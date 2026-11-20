import { TOPICS, REQS, LEARN, QUESTIONS, STORY, TEACH, SPIRIT } from "./data.js";
import { makeRng, shuffle, SlotPicker, layoutOptions, freshState, recordAnswer, reqStatus, buildRound, touchStreak, itemState } from "./engine.js";

// ---------- storage (wrapped: storage can be missing or throw) ----------
const KEY = "trailready.v1";
let memoryOnly = null;
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return Object.assign(freshState(), JSON.parse(raw));
  } catch (e) { /* fall through */ }
  return memoryOnly || freshState();
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { memoryOnly = S; }
}

let S = load();
const rng = makeRng((Date.now() ^ 0x9e3779b9) >>> 0);
const slots = new SlotPicker(rng);
const REQ_TOPIC = Object.fromEntries(REQS.map((r) => [r.id, r.topic]));
const REQ_BY_ID = Object.fromEntries(REQS.map((r) => [r.id, r]));
const app = document.getElementById("app");
const LETTERS = ["A", "B", "C", "D", "E", "F"];

function today() { return new Date().toISOString().slice(0, 10); }
function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function h(html) { app.innerHTML = html; window.scrollTo(0, 0); applySettings(); }
function topicOf(q) { return TOPICS[REQ_TOPIC[q.req]]; }

function applySettings() {
  document.body.classList.toggle("reduce-motion", !!S.settings.reduceMotion);
}

// ---------- sound (off by default) ----------
let actx = null;
function tone(ok) {
  if (!S.settings.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = "sine";
    o.frequency.value = ok ? 660 : 220;
    g.gain.setValueAtTime(0.12, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.25);
    o.connect(g); g.connect(actx.destination);
    o.start(); o.stop(actx.currentTime + 0.26);
    if (ok) {
      const o2 = actx.createOscillator(), g2 = actx.createGain();
      o2.frequency.value = 880; g2.gain.setValueAtTime(0.1, actx.currentTime + 0.1);
      g2.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.35);
      o2.connect(g2); g2.connect(actx.destination);
      o2.start(actx.currentTime + 0.1); o2.stop(actx.currentTime + 0.36);
    }
  } catch (e) {}
}
function burst() {
  if (S.settings.reduceMotion) return;
  const b = document.createElement("div");
  b.className = "burst";
  for (let i = 0; i < 10; i++) {
    const s = document.createElement("span");
    s.textContent = ["✓", "★", "✦"][i % 3];
    s.style.setProperty("--a", `${i * 36}deg`);
    b.appendChild(s);
  }
  document.body.appendChild(b);
  setTimeout(() => b.remove(), 900);
}
function buzz(ok) { try { navigator.vibrate && navigator.vibrate(ok ? 30 : [20, 40, 20]); } catch (e) {} }

// ---------- offline badge ----------
let offlineReady = false;
async function checkOffline() {
  try {
    if (!("caches" in window)) return;
    const keys = await caches.keys();
    for (const k of keys) {
      const c = await caches.open(k);
      if (await c.match("./index.html") || await c.match("index.html")) { offlineReady = true; break; }
    }
  } catch (e) {}
  const el = document.getElementById("offline");
  if (el) el.outerHTML = offlineBadge();
}
function offlineBadge() {
  return offlineReady
    ? `<span id="offline" class="badge ok">✓ Ready offline</span>`
    : `<span id="offline" class="badge wait">Saving for offline…</span>`;
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then(() => navigator.serviceWorker.ready).then(() => setTimeout(checkOffline, 800)).catch(() => {});
  navigator.serviceWorker.addEventListener && navigator.serviceWorker.addEventListener("message", (e) => { if (e.data === "cached") checkOffline(); });
}

// =====================================================================
// HOME
// =====================================================================
function counts() {
  let green = 0, partial = 0;
  for (const r of REQS) {
    const st = reqStatus(S, r.id, QUESTIONS).status;
    const ready = st === "green" && (S.teach[r.id] || !TEACH[r.id]);
    if (ready) green++; else if (st !== "gray" || S.teach[r.id]) partial++;
  }
  return { green, partial, total: REQS.length };
}

function home() {
  const c = counts();
  h(`
  <header class="top">
    <div>
      <h1>Trail Ready</h1>
      <p class="sub">Second Class, plus First Class extras</p>
    </div>
    <div class="stats">
      ${offlineBadge()}
      <span class="badge">⭐ ${S.xp} XP</span>
      <span class="badge">🔥 ${S.streak.count} day${S.streak.count === 1 ? "" : "s"}</span>
    </div>
  </header>
  <section class="trail-summary" aria-label="Requirements ready">
    <div class="bar"><span style="width:${Math.round((100 * c.green) / c.total)}%"></span></div>
    <p><strong>${c.green}</strong> of ${c.total} requirements ready · ${c.partial} in progress</p>
  </section>
  <nav class="menu">
    <button class="big" data-go="quick"><span class="ico">⚡</span><span><b>Quick Round</b><small>6 questions, mixed. Best daily habit.</small></span></button>
    <button class="big" data-go="topics"><span class="ico">🗺️</span><span><b>Pick a Topic</b><small>Warm-up, learn cards, then a round.</small></span></button>
    <button class="big" data-go="story"><span class="ico">🏜️</span><span><b>Campout Story</b><small>A night at Joshua Tree. Your choices matter.</small></span></button>
    <button class="big" data-go="order"><span class="ico">🔢</span><span><b>Put It In Order</b><small>Steps and sequences.</small></span></button>
    <button class="big" data-go="connect"><span class="ico">🔗</span><span><b>Connect It</b><small>Match, odd one out, answer + because.</small></span></button>
    <button class="big accent" data-go="signoff"><span class="ico">✅</span><span><b>Sign-Off Ready</b><small>See what's ready. Practice saying it out loud.</small></span></button>
  </nav>
  <footer class="foot"><button class="link" data-go="settings">Settings</button></footer>`);
  app.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go)));
}

function go(where, arg) {
  if (where === "home") return home();
checkOffline();
  if (where === "quick") return startRound({ title: "Quick Round", excludeMastered: true });
  if (where === "topics") return topicsScreen();
  if (where === "story") return storyNode(STORY.start);
  if (where === "order") return startRound({ title: "Put It In Order", types: ["order"], size: 4 });
  if (where === "connect") return startRound({ title: "Connect It", types: ["match", "odd", "tier"], size: 6 });
  if (where === "signoff") return signoffScreen();
  if (where === "settings") return settingsScreen();
  if (where === "req") return reqScreen(arg);
}

// =====================================================================
// TOPICS + LEARN CARDS + PRETEST
// =====================================================================
function topicsScreen() {
  const items = Object.entries(TOPICS).filter(([k]) => k !== "spirit").map(([k, t]) => {
    const rs = REQS.filter((r) => r.topic === k);
    const pct = Math.round(rs.reduce((a, r) => a + reqStatus(S, r.id, QUESTIONS).pct, 0) / rs.length);
    return `<button class="tile" data-t="${k}" style="--c:${t.color}">
      <span class="ico">${t.icon}</span><b>${t.name}</b>
      <span class="mini"><span style="width:${pct}%"></span></span></button>`;
  }).join("");
  h(`${backBar("Pick a Topic")}<div class="tiles">${items}</div>`);
  bindBack();
  app.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => topicStart(b.dataset.t)));
}

function topicStart(topic) {
  const pool = QUESTIONS.filter((q) => REQ_TOPIC[q.req] === topic && ["mc", "tier", "odd"].includes(q.type));
  if (!S.topicsStarted[topic] && pool.length >= 2) {
    // Pretesting effect: guess before being taught.
    const pre = shuffle(pool, rng).slice(0, 2);
    runQueue(pre, {
      title: `${TOPICS[topic].name}: warm-up`,
      note: "Warm-up: take your best guess. It's fine to miss these. Guessing first helps you remember the answer.",
      onDone: () => { S.topicsStarted[topic] = true; save(); learnCards(topic, 0); },
      noFinish: true,
    });
  } else {
    learnCards(topic, 0);
  }
}

function learnCards(topic, i) {
  const cards = LEARN[topic] || [];
  if (i >= cards.length) return startRound({ title: TOPICS[topic].name, topic });
  const t = TOPICS[topic];
  h(`${backBar(t.name)}
    <div class="learn" style="--c:${t.color}">
      <div class="learn-ico">${t.icon}</div>
      <p class="kicker">Learn card ${i + 1} of ${cards.length}</p>
      <p class="learn-text">${esc(cards[i])}</p>
      <button class="primary" id="gotit">Got it</button>
    </div>`);
  bindBack();
  document.getElementById("gotit").addEventListener("click", () => learnCards(topic, i + 1));
}

// =====================================================================
// ROUNDS
// =====================================================================
function startRound(opts) {
  S.round++;
  slots.newRound();
  const qs = buildRound(S, QUESTIONS, rng, { ...opts, reqTopic: REQ_TOPIC });
  if (!qs.length) return home();
checkOffline();
  runQueue(qs, opts);
}

function runQueue(qs, opts) {
  const run = { qs, i: 0, right: 0, xp0: S.xp, opts };
  showQ(run);
}

function progress(run) {
  const n = run.qs.length;
  return `<div class="progress" aria-label="Question ${run.i + 1} of ${n}">
    ${run.qs.map((_, k) => `<span class="${k < run.i ? "done" : k === run.i ? "now" : ""}"></span>`).join("")}
  </div>`;
}

function qHeader(run, q) {
  const t = topicOf(q);
  const r = REQ_BY_ID[q.req];
  return `${backBar(run.opts.title)}
    ${progress(run)}
    ${run.opts.note ? `<p class="note">${esc(run.opts.note)}</p>` : ""}
    <div class="chip" style="--c:${t.color}">${t.icon} ${r.rank === "1C" ? "First Class" : "Second Class"} ${r.id.slice(3)} · ${esc(r.label)}</div>`;
}

function showQ(run) {
  if (run.i >= run.qs.length) return finish(run);
  const q = run.qs[run.i];
  ({ mc: showMC, tier: showTier, odd: showOdd, order: showOrder, match: showMatch })[q.type](run, q);
}

function optionButtons(opts, name) {
  return `<div class="opts" role="radiogroup">${opts.map((o, k) =>
    `<button class="opt" role="radio" aria-checked="false" data-${name}="${k}"><span class="let">${LETTERS[k]}</span><span>${esc(o)}</span></button>`).join("")}</div>`;
}

function confidenceBar() {
  return `<div class="conf hidden" id="conf">
    <p>How sure are you?</p>
    <div class="conf-row">
      <button class="sure" data-sure="1">I'm sure</button>
      <button class="guess" data-sure="0">I'm guessing</button>
    </div></div>`;
}

function bindSelect(name, onPick) {
  app.querySelectorAll(`[data-${name}]`).forEach((b) => b.addEventListener("click", () => {
    app.querySelectorAll(`[data-${name}]`).forEach((x) => { x.classList.remove("sel"); x.setAttribute("aria-checked", "false"); });
    b.classList.add("sel"); b.setAttribute("aria-checked", "true");
    onPick(+b.dataset[name]);
  }));
}

function bindConfidence(onSubmit) {
  const conf = document.getElementById("conf");
  conf.classList.remove("hidden");
  conf.scrollIntoView({ behavior: S.settings.reduceMotion ? "auto" : "smooth", block: "nearest" });
  conf.querySelectorAll("[data-sure]").forEach((b) => b.onclick = () => onSubmit(b.dataset.sure === "1"));
}

// ----- Multiple choice -----
function showMC(run, q) {
  const slot = slots.next(q.wrong.length + 1);
  const wrongTexts = q.wrong.map((w) => w[0]);
  const opts = layoutOptions(q.correct, wrongTexts, slot, rng);
  h(`${qHeader(run, q)}<h2 class="q">${esc(q.q)}</h2>${optionButtons(opts, "o")}${confidenceBar()}<div id="fb"></div>`);
  bindBack();
  let pick = -1;
  bindSelect("o", (k) => { pick = k; bindConfidence(submit); });
  function submit(sure) {
    const ok = opts[pick] === q.correct;
    let why = "";
    if (!ok) {
      const w = q.wrong.find((x) => x[0] === opts[pick]);
      why = w ? w[1] : "";
    }
    lockOptions("o", opts, q.correct, pick);
    feedback(run, q, ok, sure, { mine: why, answer: q.correct });
  }
}

function lockOptions(name, opts, correct, pick) {
  app.querySelectorAll(`[data-${name}]`).forEach((b) => {
    const k = +b.dataset[name];
    b.disabled = true;
    b.classList.remove("sel");
    if (opts[k] === correct) b.classList.add("right");
    else if (k === pick) b.classList.add("wrong");
  });
}

// ----- Two-tier: answer + because -----
function showTier(run, q) {
  const s1 = slots.next(q.wrong.length + 1);
  const o1 = layoutOptions(q.correct, q.wrong, s1, rng);
  const s2 = slots.next(q.bwrong.length + 1);
  const o2 = layoutOptions(q.bcorrect, q.bwrong, s2, rng);
  h(`${qHeader(run, q)}
    <p class="kicker">Answer + Because: both parts must be right</p>
    <h2 class="q">${esc(q.q)}</h2>${optionButtons(o1, "a")}
    <div id="tier2" class="hidden"><h3 class="q2">Because… ${esc(q.bq)}</h3>${optionButtons(o2, "b")}</div>
    ${confidenceBar()}<div id="fb"></div>`);
  bindBack();
  let p1 = -1, p2 = -1;
  bindSelect("a", (k) => { p1 = k; document.getElementById("tier2").classList.remove("hidden"); if (p2 >= 0) bindConfidence(submit); });
  bindSelect("b", (k) => { p2 = k; if (p1 >= 0) bindConfidence(submit); });
  function submit(sure) {
    const ok1 = o1[p1] === q.correct, ok2 = o2[p2] === q.bcorrect;
    lockOptions("a", o1, q.correct, p1);
    lockOptions("b", o2, q.bcorrect, p2);
    let mine = "";
    if (!ok1 && ok2) mine = "You had the right reason but the wrong answer. The reason should lead you to the answer.";
    if (ok1 && !ok2) mine = "Right answer, but not the right reason. Knowing WHY is what lets you handle new situations.";
    feedback(run, q, ok1 && ok2, sure, { mine, answer: `${q.correct}. Because: ${q.bcorrect}` });
  }
}

// ----- Odd one out + because -----
function showOdd(run, q) {
  const s1 = slots.next(q.others.length + 1);
  const o1 = layoutOptions(q.oddOne, q.others, s1, rng);
  const s2 = slots.next(q.bwrong.length + 1);
  const o2 = layoutOptions(q.bcorrect, q.bwrong, s2, rng);
  h(`${qHeader(run, q)}
    <p class="kicker">Odd one out</p>
    <h2 class="q">${esc(q.q)}</h2>${optionButtons(o1, "a")}
    <div id="tier2" class="hidden"><h3 class="q2">Why doesn't it belong?</h3>${optionButtons(o2, "b")}</div>
    ${confidenceBar()}<div id="fb"></div>`);
  bindBack();
  let p1 = -1, p2 = -1;
  bindSelect("a", (k) => { p1 = k; document.getElementById("tier2").classList.remove("hidden"); if (p2 >= 0) bindConfidence(submit); });
  bindSelect("b", (k) => { p2 = k; if (p1 >= 0) bindConfidence(submit); });
  function submit(sure) {
    const ok1 = o1[p1] === q.oddOne, ok2 = o2[p2] === q.bcorrect;
    lockOptions("a", o1, q.oddOne, p1);
    lockOptions("b", o2, q.bcorrect, p2);
    feedback(run, q, ok1 && ok2, sure, { mine: ok1 && !ok2 ? "You found the odd one. The reason is the part that builds the connection." : "", answer: `${q.oddOne}. Why: ${q.bcorrect}` });
  }
}

// ----- Put it in order (drag, or tap two to swap) -----
function showOrder(run, q) {
  let cur = shuffle(q.steps, rng);
  let guard = 0;
  while (cur.every((s, k) => s === q.steps[k]) && guard++ < 10) cur = shuffle(q.steps, rng);
  let tries = 0, selected = -1;
  render();
  function render(marks) {
    h(`${qHeader(run, q)}
      <p class="kicker">Put it in order · drag, or tap two steps to swap them</p>
      <h2 class="q">${esc(q.q)}</h2>
      <ol class="order" id="ol">${cur.map((s, k) => `<li class="step ${marks ? (marks[k] ? "right" : "wrong") : ""} ${k === selected ? "sel" : ""}" data-k="${k}">
        <span class="num">${k + 1}</span><span class="txt">${esc(s)}</span><span class="grip" aria-hidden="true">⋮⋮</span></li>`).join("")}</ol>
      <div id="act">${marks ? "" : `<button class="primary" id="check">Check order</button>`}</div><div id="fb"></div>`);
    bindBack();
    if (marks) return;
    document.getElementById("check").onclick = check;
    const ol = document.getElementById("ol");
    ol.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        if (dragMoved) return;
        const k = +li.dataset.k;
        if (selected < 0) { selected = k; render(); }
        else if (selected === k) { selected = -1; render(); }
        else { [cur[selected], cur[k]] = [cur[k], cur[selected]]; selected = -1; render(); }
      });
    });
    enableDrag(ol, (from, to) => { const [x] = cur.splice(from, 1); cur.splice(to, 0, x); selected = -1; render(); });
  }
  function check() {
    tries++;
    const marks = cur.map((s, k) => s === q.steps[k]);
    const ok = marks.every(Boolean);
    render(marks);
    if (ok) return feedback(run, q, tries === 1, true, { answer: "" , note: tries > 1 ? "Fixed on the second try. It will come back for review." : "" });
    if (tries === 1) {
      const right = marks.filter(Boolean).length;
      document.getElementById("act").innerHTML = `<p class="hint">${right} of ${q.steps.length} are in the right spot (green). Think: what has to happen before each orange step?</p><button class="primary" id="retry">Try again</button>`;
      document.getElementById("retry").onclick = () => render();
      return;
    }
    feedback(run, q, false, true, { answer: q.steps.map((s, k) => `${k + 1}. ${s}`).join("\n") });
  }
}

let dragMoved = false;
function enableDrag(ol, onMove) {
  let dragging = null, startY = 0, from = -1;
  ol.querySelectorAll(".grip, .step").forEach((el) => el.style.touchAction = "none");
  ol.addEventListener("pointerdown", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    dragging = li; from = +li.dataset.k; startY = e.clientY; dragMoved = false;
    li.setPointerCapture && li.setPointerCapture(e.pointerId);
  });
  ol.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dy = e.clientY - startY;
    if (Math.abs(dy) > 8) dragMoved = true;
    if (dragMoved) { dragging.classList.add("dragging"); dragging.style.transform = `translateY(${dy}px)`; }
  });
  const end = (e) => {
    if (!dragging) return;
    const li = dragging; dragging = null;
    if (!dragMoved) { li.style.transform = ""; return; }
    const others = [...ol.querySelectorAll("li")].filter((x) => x !== li);
    const to = others.filter((x) => { const r = x.getBoundingClientRect(); return r.top + r.height / 2 < e.clientY; }).length;
    li.style.transform = "";
    setTimeout(() => { dragMoved = false; }, 50);
    if (to !== from) onMove(from, to);
  };
  ol.addEventListener("pointerup", end);
  ol.addEventListener("pointercancel", end);
}

// ----- Connect It: matching -----
function showMatch(run, q) {
  const left = q.pairs.map((p) => p[0]);
  const right = shuffle(q.pairs.map((p) => p[1]), rng);
  const assign = {}; // leftIndex -> rightIndex
  let selL = -1;
  const COLORS = ["#2dd4bf", "#f59e0b", "#60a5fa", "#86efac", "#818cf8", "#fcd34d"];
  render();
  function render(result) {
    const usedR = Object.values(assign);
    h(`${qHeader(run, q)}
      <p class="kicker">Connect It · tap a left item, then its match on the right</p>
      <h2 class="q">${esc(q.q)}</h2>
      <div class="match">
        <div class="col">${left.map((t, k) => {
          const a = assign[k];
          const mark = result ? (result[k] ? "right" : "wrong") : "";
          return `<button class="m ${k === selL ? "sel" : ""} ${mark}" data-l="${k}" ${a !== undefined ? `style="--mc:${COLORS[k % COLORS.length]}"` : ""}>
            ${a !== undefined ? `<span class="dot" style="background:${COLORS[k % COLORS.length]}">${k + 1}</span>` : ""}${esc(t)}</button>`;
        }).join("")}</div>
        <div class="col">${right.map((t, j) => {
          const owner = Object.keys(assign).find((k) => assign[k] === j);
          return `<button class="m r" data-r="${j}" ${owner !== undefined ? `style="--mc:${COLORS[owner % COLORS.length]}"` : ""}>
            ${owner !== undefined ? `<span class="dot" style="background:${COLORS[owner % COLORS.length]}">${+owner + 1}</span>` : ""}${esc(t)}</button>`;
        }).join("")}</div>
      </div>
      <div id="act">${result ? "" : `<button class="primary" id="check" ${usedR.length < left.length ? "disabled" : ""}>Check matches</button>`}</div>
      <div id="fb"></div>`);
    bindBack();
    if (result) return;
    app.querySelectorAll("[data-l]").forEach((b) => b.onclick = () => { selL = +b.dataset.l; render(); });
    app.querySelectorAll("[data-r]").forEach((b) => b.onclick = () => {
      const j = +b.dataset.r;
      if (selL < 0) {
        // Tapping a matched right item clears that match.
        const owner = Object.keys(assign).find((k) => assign[k] === j);
        if (owner !== undefined) { delete assign[owner]; render(); }
        return;
      }
      for (const k of Object.keys(assign)) if (assign[k] === j) delete assign[k];
      assign[selL] = j;
      const nextFree = left.findIndex((_, k) => assign[k] === undefined);
      selL = nextFree;
      render();
    });
    const c = document.getElementById("check");
    if (c) c.onclick = () => {
      const res = left.map((_, k) => right[assign[k]] === q.pairs[k][1]);
      render(res);
      const ok = res.every(Boolean);
      feedback(run, q, ok, true, { answer: ok ? "" : q.pairs.map((p) => `${p[0]} → ${p[1]}`).join("\n") });
    };
  }
}

// ----- Feedback (shared) -----
function feedback(run, q, ok, sure, info) {
  recordAnswer(S, q, { correct: ok, sure });
  touchStreak(S, today());
  save();
  if (ok) { run.right++; tone(true); buzz(true); burst(); } else { tone(false); buzz(false); }
  const conf = document.getElementById("conf");
  if (conf) conf.remove();
  const guessNote = ok && !sure ? `<p class="small">You guessed right. It will come back until you're sure.</p>` : "";
  const hyperNote = !ok && sure ? `<p class="small">You were sure, so this one comes back first next round. Sure-but-wrong answers are the easiest to fix once you see them.</p>` : "";
  const fb = document.getElementById("fb");
  fb.innerHTML = `<div class="feedback ${ok ? "good" : "bad"}" role="status">
    <p class="verdict">${ok ? "✓ Right!" : "Not quite."}</p>
    ${info.mine ? `<p>${esc(info.mine)}</p>` : ""}
    ${!ok && info.answer ? `<p class="answer"><b>Correct:</b><br>${esc(info.answer).replace(/\n/g, "<br>")}</p>` : ""}
    ${info.note ? `<p class="small">${esc(info.note)}</p>` : ""}
    <p>${esc(q.why)}</p>
    ${q.jt ? `<p class="jt">🌵 Why it matters at Joshua Tree: ${esc(q.jt)}</p>` : ""}
    ${guessNote}${hyperNote}
    <button class="primary" id="next">${run.i + 1 < run.qs.length ? "Next" : "Finish"}</button>
  </div>`;
  fb.scrollIntoView({ behavior: S.settings.reduceMotion ? "auto" : "smooth", block: "start" });
  document.getElementById("next").onclick = () => { run.i++; showQ(run); };
}

function finish(run) {
  if (run.opts.onDone) return run.opts.onDone();
  const gained = S.xp - run.xp0;
  const n = run.qs.length;
  const msg = run.right === n ? "Perfect round!" : run.right >= n - 1 ? "Strong round." : run.right >= n / 2 ? "Good work. Misses come back for review." : "That's how learning works. Misses come back soon.";
  h(`<div class="finish">
      <div class="big-num">${run.right}<span>/${n}</span></div>
      <h2>${msg}</h2>
      <p>+${gained} XP · ${S.xp} total</p>
      <button class="primary" id="again">One more round?</button>
      <button class="secondary" id="toHome">Home</button>
    </div>`);
  if (run.right >= n - 1) burst();
  document.getElementById("again").onclick = () => startRound(run.opts);
  document.getElementById("toHome").onclick = home;
}

// =====================================================================
// STORY MODE
// =====================================================================
function storyNode(id) {
  const node = STORY.nodes[id];
  if (node.end) {
    S.storyDone = true; S.xp += 30; save();
    h(`${backBar("Campout Story")}<div class="finish"><div class="big-num">🏕️</div><h2>Campout complete</h2><p>${esc(node.text)}</p>
      <button class="primary" id="again">Play again</button><button class="secondary" id="toHome">Home</button></div>`);
    burst();
    document.getElementById("again").onclick = () => storyNode(STORY.start);
    document.getElementById("toHome").onclick = home;
    return;
  }
  const r = REQ_BY_ID[node.req];
  const t = TOPICS[r.topic];
  const correct = node.choices.find((c) => c.ok);
  const wrongs = node.choices.filter((c) => !c.ok);
  const order = layoutOptions(correct, wrongs, slots.next(node.choices.length), rng);
  h(`${backBar("Campout Story")}
    <div class="chip" style="--c:${t.color}">${t.icon} ${esc(r.label)}</div>
    <div class="story"><p>${esc(node.text)}</p></div>
    <h2 class="q">What do you do?</h2>
    ${optionButtons(order.map((c) => c.t), "o")}<div id="fb"></div>`);
  bindBack();
  app.querySelectorAll("[data-o]").forEach((b) => b.onclick = () => {
    const c = order[+b.dataset.o];
    tone(c.ok); buzz(c.ok);
    if (c.ok) burst();
    app.querySelectorAll("[data-o]").forEach((x) => x.disabled = true);
    b.classList.add(c.ok ? "right" : "wrong");
    document.getElementById("fb").innerHTML = `<div class="feedback ${c.ok ? "good" : "bad"}"><p class="verdict">${c.ok ? "✓ Good call" : "Think again"}</p><p>${esc(c.fb)}</p>
      <button class="primary" id="next">${c.ok ? "Continue" : "Try again"}</button></div>`;
    document.getElementById("next").onclick = () => storyNode(c.next);
  });
}

// =====================================================================
// SIGN-OFF READY + TEACH-BACK
// =====================================================================
function statusDot(r) {
  const st = reqStatus(S, r.id, QUESTIONS);
  const hasTeach = !!TEACH[r.id];
  const ready = (r.id === "2C-10") ? !!S.teach[r.id] : st.status === "green" && (!hasTeach || S.teach[r.id]);
  const cls = ready ? "green" : (st.status !== "gray" || S.teach[r.id]) ? "partial" : "gray";
  return { cls, st, ready };
}

function signoffScreen() {
  const group = (rank, title) => `<h2 class="group">${title}</h2>` + REQS.filter((r) => r.rank === rank).map((r) => {
    const d = statusDot(r);
    const t = TOPICS[r.topic];
    return `<button class="req" data-r="${r.id}"><span class="marker ${d.cls}"></span>
      <span class="req-body"><b>${r.id.slice(3)} · ${esc(r.label)}</b>
      <small>${d.ready ? "Ready for sign-off" : r.id === "2C-10" ? "Coaching, no quiz" : `${d.st.pct}% mastered${TEACH[r.id] ? (S.teach[r.id] ? " · said it out loud ✓" : " · say it out loud next") : ""}`}</small></span>
      <span class="ico sm">${t.icon}</span></button>`;
  }).join("");
  h(`${backBar("Sign-Off Ready")}
    <p class="note">Green means: mastered in the app <b>and</b> practiced out loud. Show this screen to a leader: "I'm ready for these."</p>
    <div class="legend"><span><i class="marker gray"></i>Not started</span><span><i class="marker partial"></i>In progress</span><span><i class="marker green"></i>Ready</span></div>
    ${group("2C", "Second Class")}${group("1C", "First Class extras")}`);
  bindBack();
  app.querySelectorAll("[data-r]").forEach((b) => b.onclick = () => reqScreen(b.dataset.r));
}

function reqScreen(id) {
  if (id === "2C-10") return spiritScreen();
  const r = REQ_BY_ID[id];
  const t = TOPICS[r.topic];
  const d = statusDot(r);
  const checks = TEACH[id] || [];
  h(`${backBar("Sign-Off Ready", "signoff")}
    <div class="chip" style="--c:${t.color}">${t.icon} ${r.rank === "1C" ? "First Class" : "Second Class"} ${id.slice(3)}</div>
    <h2 class="q">${esc(r.label)}</h2>
    <div class="task"><p class="kicker">The requirement</p><p>${esc(r.task)}</p></div>
    <div class="bar"><span style="width:${d.st.pct}%"></span></div><p class="small">${d.st.pct}% mastered in the app</p>
    <button class="primary" id="practice">Practice this one</button>
    <div class="teach">
      <h3>Say It to the Scoutmaster</h3>
      <p>Say your answer <b>out loud</b>, like you're talking to your Scoutmaster. Then check what you covered. Be honest: missing one just means another try.</p>
      ${checks.map((c, k) => `<label class="check"><input type="checkbox" data-c="${k}" ${S.teach[id] ? "checked" : ""}><span>${esc(c)}</span></label>`).join("")}
      <p class="small" id="teachMsg">${S.teach[id] ? "✓ Done. You're ready to explain this one." : ""}</p>
    </div>`);
  bindBack("signoff");
  document.getElementById("practice").onclick = () => {
    S.round++; slots.newRound();
    const qs = shuffle(QUESTIONS.filter((q) => q.req === id), rng).slice(0, 6);
    runQueue(qs, { title: r.label });
  };
  const boxes = [...app.querySelectorAll("[data-c]")];
  boxes.forEach((b) => b.onchange = () => {
    const all = boxes.every((x) => x.checked);
    S.teach[id] = all;
    if (all) { S.xp += 15; burst(); tone(true); }
    save();
    document.getElementById("teachMsg").textContent = all ? "✓ Done. You're ready to explain this one." : "";
  });
}

function spiritScreen() {
  const id = "2C-10";
  h(`${backBar("Scout Spirit", "signoff")}
    <div class="chip" style="--c:${TOPICS.spirit.color}">${TOPICS.spirit.icon} Second Class 10</div>
    <div class="task"><p class="kicker">The requirement</p><p>${esc(REQ_BY_ID[id].task)}</p></div>
    <p>${esc(SPIRIT.intro)}</p>
    <h3>Duty: ideas for an honest answer</h3>
    <ul class="list">${SPIRIT.duty.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
    <div class="story"><p>${esc(SPIRIT.sample)}</p></div>
    <p class="small">${esc(SPIRIT.tip)}</p>
    <h3>Four points of the Scout Law</h3>
    <p>${esc(SPIRIT.lawPrompt)}</p>
    <div class="law">${SPIRIT.lawPoints.map((p) => `<span>${p}</span>`).join("")}</div>
    <div class="teach">
      <h3>Ready check</h3>
      ${["I can say, honestly and in my own words, what duty means to me", "I have one real example of respecting other people's beliefs", "I picked four Scout Law points I didn't use for Tenderfoot", "I have a true story for each of the four"].map((c, k) =>
        `<label class="check"><input type="checkbox" data-c="${k}" ${S.teach[id] ? "checked" : ""}><span>${esc(c)}</span></label>`).join("")}
      <p class="small" id="teachMsg">${S.teach[id] ? "✓ Ready." : ""}</p>
    </div>`);
  bindBack("signoff");
  const boxes = [...app.querySelectorAll("[data-c]")];
  boxes.forEach((b) => b.onchange = () => {
    const all = boxes.every((x) => x.checked);
    S.teach[id] = all; save();
    if (all) { burst(); tone(true); }
    document.getElementById("teachMsg").textContent = all ? "✓ Ready." : "";
  });
}

// =====================================================================
// SETTINGS
// =====================================================================
function settingsScreen() {
  h(`${backBar("Settings")}
    <label class="check"><input type="checkbox" id="snd" ${S.settings.sound ? "checked" : ""}><span>Sound effects</span></label>
    <label class="check"><input type="checkbox" id="rm" ${S.settings.reduceMotion ? "checked" : ""}><span>Reduce motion</span></label>
    <h3>Progress</h3>
    <button class="secondary" id="exp">Export progress file</button>
    <label class="secondary filebtn">Import progress file<input type="file" id="imp" accept="application/json"></label>
    <button class="secondary danger" id="reset">Reset all progress</button>
    <div id="confirm"></div>
    <p class="small">Progress is saved on this device only. Nothing is sent anywhere.</p>`);
  bindBack();
  document.getElementById("snd").onchange = (e) => { S.settings.sound = e.target.checked; save(); tone(true); };
  document.getElementById("rm").onchange = (e) => { S.settings.reduceMotion = e.target.checked; save(); applySettings(); };
  document.getElementById("exp").onclick = () => {
    const blob = new Blob([JSON.stringify(S, null, 1)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `trail-ready-progress-${today()}.json`;
    a.click();
  };
  document.getElementById("imp").onchange = async (e) => {
    try {
      const f = e.target.files[0];
      const data = JSON.parse(await f.text());
      if (!data.items) throw new Error("bad");
      S = Object.assign(freshState(), data); save(); home();
checkOffline();
    } catch (err) { document.getElementById("confirm").innerHTML = `<p class="hint">That file didn't look like a Trail Ready progress file.</p>`; }
  };
  document.getElementById("reset").onclick = () => {
    document.getElementById("confirm").innerHTML = `<div class="feedback bad"><p>Erase all progress on this device?</p>
      <button class="secondary danger" id="yes">Yes, erase</button><button class="secondary" id="no">Cancel</button></div>`;
    document.getElementById("yes").onclick = () => { S = freshState(); save(); home(); };
    document.getElementById("no").onclick = () => { document.getElementById("confirm").innerHTML = ""; };
  };
}

// ---------- shared bits ----------
function backBar(title, target = "home") {
  return `<div class="backbar"><button class="back" data-back="${target}" aria-label="Back">←</button><span>${esc(title)}</span></div>`;
}
function bindBack(target) {
  const b = app.querySelector("[data-back]");
  if (b) b.onclick = () => go(target || b.dataset.back);
}

home();
checkOffline();
