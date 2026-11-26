import { SECTIONS, REQS } from "./learn.js";
import { BANK } from "./bank.js";
import { makeRng, shuffle, SlotPicker, layoutOptions, buildTest } from "./engine.js";

// Saved state: which requirements are marked done, and which questions were answered right.
const KEY = "secondclass.v1";
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.done && s.right) return s; } catch (e) {}
  return { done: {}, right: {} };
}
let S = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

const rng = makeRng((Date.now() ^ 0x9e3779b9) >>> 0);
const slots = new SlotPicker(rng);
const app = document.getElementById("app");
const LETTERS = ["A", "B", "C", "D"];
const YES = ["Correct.", "Yep.", "Nailed it.", "Right.", "That's it.", "Exactly."];
const NO = ["Not quite.", "Nope. Close, though.", "Not that one.", "Good try. Here's the real answer."];
const pickLine = (a) => a[Math.floor(Math.random() * a.length)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function h(html) { app.innerHTML = html; window.scrollTo(0, 0); }

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});

// ---------- Home ----------
function home() {
  h(`<header class="top"><h1>Second Class</h1></header>
    ${SECTIONS.map((s) => `<section class="sec"><h2>${esc(s.name)}</h2><ul class="rows">
      ${s.items.map((k) => `<li><button class="row" data-k="${k}"><span>${esc(REQS[k].name)}</span>${S.done[k] ? `<span class="done">Done</span>` : `<span class="chev">›</span>`}</button></li>`).join("")}
    </ul></section>`).join("")}`);
  app.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => req(b.dataset.k)));
}

function bar(title) {
  return `<header class="bar"><button class="back" aria-label="Back">‹</button><span>${esc(title)}</span></header>`;
}
function bindBar(back) { app.querySelector(".back").onclick = back; }

// ---------- Requirement: before you start, learn, test ----------
function figure(im) {
  if (!im) return "";
  const fit = im.ratio ? ` style="aspect-ratio:${esc(im.ratio)};object-fit:cover;object-position:${esc(im.pos || "50% 50%")}"` : "";
  return `<figure class="photo"><img src="${esc(im.src)}" alt=""${fit} loading="lazy">${im.credit ? `<figcaption>${esc(im.credit)}</figcaption>` : ""}</figure>`;
}
function cards(list) {
  return list.map((c) => `<article class="card"><h3>${esc(c.h)}</h3>${figure(c.img)}${c.p.map((l) => `<p>${esc(l)}</p>`).join("")}</article>`).join("");
}

function req(k) {
  const r = REQS[k];
  const total = BANK.filter((q) => q.r === k).length;
  const left = BANK.filter((q) => q.r === k && !S.right[q.id]).length;
  h(`${bar("Second Class")}
    <h1 class="title">${esc(r.name)}</h1>
    ${r.before ? `<p class="label">Before you start</p>${cards(r.before)}` : ""}
    <p class="label">Learn</p>${cards(r.learn)}
    <p class="label">Test</p>
    ${left ? `<button class="primary" id="test">${left === total ? "Test yourself" : "Keep going"} · ${left} question${left === 1 ? "" : "s"}</button>`
           : `<p class="quiet">You've gotten every one of these right. Go get it signed off.</p><button class="secondary" id="again">Run it again anyway</button>`}
    <label class="toggle"><input type="checkbox" id="done" ${S.done[k] ? "checked" : ""}><span>Already done</span></label>`);
  bindBar(home);
  const t = document.getElementById("test");
  if (t) t.onclick = () => startTest(k);
  const a = document.getElementById("again");
  if (a) a.onclick = () => { BANK.filter((q) => q.r === k).forEach((q) => delete S.right[q.id]); save(); startTest(k); };
  document.getElementById("done").onchange = (e) => { if (e.target.checked) S.done[k] = true; else delete S.done[k]; save(); };
}

// ---------- Test ----------
function startTest(k) {
  slots.newTest();
  show({ k, qs: buildTest(BANK, k, S.right, rng), i: 0, missed: [], retry: false, finalMiss: [] });
}

function show(run) {
  if (run.i >= run.qs.length) {
    // Missed questions come back once, at the end of this test.
    if (!run.retry && run.missed.length) { run.retry = true; run.qs = shuffle(run.missed, rng); run.i = 0; }
    else return finish(run);
  }
  const q = run.qs[run.i];
  ({ mc: showMC, order: showOrder, match: showMatch })[q.t](run, q);
}

function head(run) {
  const pct = Math.round((100 * run.i) / run.qs.length);
  return `${bar(REQS[run.k].name)}<div class="line"><span style="width:${pct}%"></span></div>
    ${run.retry ? `<p class="label">Round two: the ones you missed</p>` : ""}`;
}

function result(run, q, ok, answerText) {
  if (ok) S.right[q.id] = true;
  else if (run.retry) run.finalMiss.push(q);
  else run.missed.push(q);
  save();
  const fb = document.getElementById("fb");
  fb.innerHTML = `<div class="fb ${ok ? "ok" : "no"}"><p class="verdict">${pickLine(ok ? YES : NO)}</p>
    ${ok ? "" : `<p>${esc(answerText).replace(/\n/g, "<br>")}</p>`}
    <button class="primary" id="next">Next</button></div>`;
  fb.scrollIntoView({ block: "nearest" });
  document.getElementById("next").onclick = () => { run.i++; show(run); };
}

function showMC(run, q) {
  const opts = layoutOptions(q.a, q.w, slots.next(q.w.length + 1), rng);
  const img = figure(q.img);
  h(`${head(run)}<h2 class="q">${esc(q.q)}</h2>${img}
    <div class="opts">${opts.map((o, n) => `<button class="opt" data-o="${n}"><span class="let">${LETTERS[n]}</span><span>${esc(o)}</span></button>`).join("")}</div>
    <div id="fb"></div>`);
  bindBar(() => req(run.k));
  app.querySelectorAll("[data-o]").forEach((b) => (b.onclick = () => {
    const pick = +b.dataset.o;
    const ok = opts[pick] === q.a;
    app.querySelectorAll("[data-o]").forEach((x) => {
      x.disabled = true;
      if (opts[+x.dataset.o] === q.a) x.classList.add("right");
      else if (+x.dataset.o === pick) x.classList.add("wrong");
    });
    result(run, q, ok, q.a);
  }));
}

// Put in order: tap steps in order; each tap fills the next slot. Tap a placed step to send it back.
function showOrder(run, q) {
  const pool = shuffle(q.steps, rng);
  if (pool.every((s, n) => s === q.steps[n])) pool.reverse();
  const placed = [];
  let checked = false;
  draw();
  function draw(marks) {
    h(`${head(run)}<h2 class="q">${esc(q.q)}</h2>
      <p class="quiet small">Tap them in order. Tap a placed one to take it back.</p>
      <ol class="slots">${q.steps.map((_, n) => {
        const s = placed[n];
        const m = marks ? (marks[n] ? "right" : "wrong") : "";
        return `<li class="slot ${s ? "filled" : ""} ${m}" ${s && !checked ? `data-p="${n}"` : ""}><span class="num">${n + 1}</span><span>${s ? esc(s) : ""}</span></li>`;
      }).join("")}</ol>
      ${checked ? "" : `<div class="pool">${pool.map((s, n) => placed.includes(s) ? "" : `<button class="chip" data-s="${n}">${esc(s)}</button>`).join("")}</div>`}
      <div id="fb"></div>`);
    bindBar(() => req(run.k));
    if (checked) return;
    app.querySelectorAll("[data-s]").forEach((b) => (b.onclick = () => {
      placed.push(pool[+b.dataset.s]);
      if (placed.length === q.steps.length) {
        checked = true;
        const marks = placed.map((s, n) => s === q.steps[n]);
        draw(marks);
        result(run, q, marks.every(Boolean), q.steps.map((s, n) => `${n + 1}. ${s}`).join("\n"));
      } else draw();
    }));
    app.querySelectorAll("[data-p]").forEach((b) => (b.onclick = () => { placed.splice(+b.dataset.p, 1); draw(); }));
  }
}

// Match: tap an item on the left, then its match on the right.
function showMatch(run, q) {
  const left = q.pairs.map((p) => p[0]);
  const right = shuffle(q.pairs.map((p) => p[1]), rng);
  const pick = {};
  let sel = 0, done = false;
  draw();
  function draw(res) {
    h(`${head(run)}<h2 class="q">${esc(q.q)}</h2>
      <p class="quiet small">Tap one on the left, then its match on the right.</p>
      <div class="match"><div class="col">${left.map((t, n) => `<button class="m ${n === sel && !done ? "sel" : ""} ${res ? (res[n] ? "right" : "wrong") : ""}" data-l="${n}">${pick[n] !== undefined ? `<span class="tag">${n + 1}</span>` : ""}${esc(t)}</button>`).join("")}</div>
      <div class="col">${right.map((t, j) => { const o = Object.keys(pick).find((n) => pick[n] === j); return `<button class="m" data-r="${j}">${o !== undefined ? `<span class="tag">${+o + 1}</span>` : ""}${esc(t)}</button>`; }).join("")}</div></div>
      <div id="fb"></div>`);
    bindBar(() => req(run.k));
    if (done) return;
    app.querySelectorAll("[data-l]").forEach((b) => (b.onclick = () => { sel = +b.dataset.l; draw(); }));
    app.querySelectorAll("[data-r]").forEach((b) => (b.onclick = () => {
      const j = +b.dataset.r;
      for (const n of Object.keys(pick)) if (pick[n] === j) delete pick[n];
      pick[sel] = j;
      const free = left.findIndex((_, n) => pick[n] === undefined);
      if (free === -1) {
        done = true;
        const res = left.map((_, n) => right[pick[n]] === q.pairs[n][1]);
        draw(res);
        result(run, q, res.every(Boolean), q.pairs.map((p) => `${p[0]}: ${p[1]}`).join("\n"));
      } else { sel = free; draw(); }
    }));
  }
}

function finish(run) {
  const miss = run.retry ? run.finalMiss : run.missed;
  const ans = (q) => q.t === "mc" ? q.a : q.t === "order" ? q.steps.join(" → ") : q.pairs.map((p) => p[0] + ": " + p[1]).join("; ");
  h(`${bar(REQS[run.k].name)}
    ${miss.length ? `<h1 class="title">Not yet. Look these over.</h1>${miss.map((q) => `<article class="card"><h3>${esc(q.q)}</h3><p>${esc(ans(q))}</p></article>`).join("")}`
      : `<h1 class="title">Ready.</h1><p class="quiet">You know this. Go sit down with someone and prove it.</p>`}
    <button class="primary" id="backreq">Back to ${esc(REQS[run.k].name)}</button>`);
  bindBar(() => req(run.k));
  document.getElementById("backreq").onclick = () => req(run.k);
}

home();
