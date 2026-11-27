import { makeRng, SlotPicker, layoutOptions } from "../site/engine.js";
import { BANK, REQS, SECTIONS } from "../site/content.js";
import { BANK as CORE_BANK } from "../site/bank.js";
import { REQS as CORE_REQS } from "../site/learn.js";

import { report } from "./cues.mjs";
import { readFileSync, readdirSync, existsSync } from "fs";
let fail = false;
const bad = (m) => { console.log("FAIL:", m); fail = true; };

// 1. Answer positions balanced, never three in a row.
const rng = makeRng(12345); const p = new SlotPicker(rng);
const counts = [0, 0, 0, 0]; let total = 0, run = 1, maxRun = 1, last = -1;
for (let r = 0; r < 1000; r++) { p.newTest(); const n = 4 + Math.floor(rng() * 10);
  for (let i = 0; i < n; i++) { const s = p.next(4); counts[s]++; total++; run = s === last ? run + 1 : 1; last = s; maxRun = Math.max(maxRun, run); } }
const shares = counts.map((c) => +(100 * c / total).toFixed(1));
console.log("slot shares %", shares, "max streak", maxRun);
if (shares.some((x) => x > 30)) bad("a slot exceeds 30%");
if (maxRun >= 3) bad("three in a row");
for (let s = 0; s < 4; s++) { const o = layoutOptions("C", ["x", "y", "z"], s, rng); if (o[s] !== "C") bad("layout"); }

// 2. Guessing strategies stay near chance.
for (const [k, v] of Object.entries(report())) { const pct = 100 * v; console.log(`strategy ${k}: ${pct.toFixed(1)}%`); if (pct > 33 || pct < 15) bad(`strategy ${k} is a usable cue`); }

// 3. Bank sanity.
const ids = new Set();
for (const q of BANK) {
  if (ids.has(q.id)) bad("duplicate id " + q.id); ids.add(q.id);
  if (!REQS[q.r]) bad("unknown requirement " + q.r);
  if (!["mc", "order", "match"].includes(q.t)) bad("type " + q.t);
  if (q.t === "mc" && (q.w.length !== 3 || q.w.includes(q.a))) bad("mc options " + q.id);
  if (q.t === "order" && new Set(q.steps).size !== q.steps.length) bad("dup step " + q.id);
}
for (const s of SECTIONS) for (const k of s.items) { if (!REQS[k]) bad("missing req " + k); if (!BANK.some((q) => q.r === k)) bad("no questions for " + k); }

// 3b. Ordering only where order is the knowledge.
const ORDER_OK = new Set(["firewood", "buildfire", "stoves", "noswim", "compass", "nocompass", "firstaid", "hurry", "emergency", "vehicle", "ceremony", "flag"]);
for (const q of BANK) if (q.t === "order" && !ORDER_OK.has(q.r)) bad("ordering not allowed for " + q.r + " " + q.id);

// 3c. Every local image exists; every image has a source.
for (const q of BANK) if (q.img && !q.img.src) bad("image without src " + q.id);
for (const k of Object.keys(REQS)) for (const c of [...(REQS[k].before || []), ...REQS[k].learn])
  if (c.img && !/^https:/.test(c.img.src) && !existsSync("site/" + c.img.src)) bad("missing image " + c.img.src);

// 3d. Core content works anywhere: no local places, species or coast-only content outside site/regions.
const LOCAL = /la jolla|san diego|ocean|\btides?\b|sea lion|beach|torrey|\bcove\b|stingray|santa ana|bluff|\bsurf\b|surfgrass|\bseals?\b|tidepool/i;
for (const f of ["site/learn.js", "site/bank.js"]) {
  const m = readFileSync(f, "utf8").match(LOCAL); if (m) bad(`local content "${m[0]}" in ${f}`);
}

// 3e. Every question belongs to a requirement and has a row in docs/audit.csv.
const audit = readFileSync("docs/audit.csv", "utf8");
for (const q of BANK) {
  if (!REQS[q.r]) bad("question with no requirement " + q.id);
  if (!audit.includes(q.id + ",")) bad("question missing from audit " + q.id);
}

// 3f. Exactly one Pledge question.
const pledge = BANK.filter((q) => /Pledge of Allegiance start/.test(q.q || "")).length;
if (pledge !== 1) bad("expected one Pledge question, found " + pledge);

// 4. Banned content anywhere in the site's text.
const BANNED = [/joshua/i, /\bXP\b/, /\bstreak\b/i, /I.m sure/i, /guess/i, /pledge drill/i, /my logs|service hours|activity log/i, /2C-\d/, /type="text"/, /trail ready/i, /\$\d/, /U-shaped bend/i, /rabbit/i, /both short ends/i, /fire triangle/i];
for (const f of readdirSync("site").filter((f) => /\.(js|html|json|css)$/.test(f))) {
  const t = readFileSync("site/" + f, "utf8");
  for (const re of BANNED) if (re.test(t)) bad(`${f} contains ${re}`);
}
console.log(BANK.length, "questions;", Object.keys(REQS).length, "requirements");
console.log(fail ? "TESTS FAILED" : "ALL TESTS PASSED");
process.exit(fail ? 1 : 0);
