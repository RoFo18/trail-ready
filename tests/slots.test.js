import { makeRng, SlotPicker, layoutOptions } from "../site/engine.js";
import { QUESTIONS } from "../site/questions.js";
let fail = false;
const rng = makeRng(12345);
const p = new SlotPicker(rng);
const counts = [0,0,0,0]; let total = 0, run = 1, maxRun = 1, last = -1;
for (let r = 0; r < 1000; r++) {
  p.newRound();
  const calls = 6 + Math.floor(rng() * 6);
  for (let i = 0; i < calls; i++) {
    const s = p.next(4);
    counts[s]++; total++;
    run = s === last ? run + 1 : 1; last = s; maxRun = Math.max(maxRun, run);
  }
}
const shares = counts.map(c => +(100*c/total).toFixed(1));
console.log("slot shares %", shares, "max streak", maxRun);
if (shares.some(x => x > 30)) { console.log("FAIL: a slot exceeds 30%"); fail = true; }
if (maxRun >= 3) { console.log("FAIL: three in a row"); fail = true; }
// layout puts correct at the chosen slot
for (let s = 0; s < 4; s++) { const o = layoutOptions("C", ["x","y","z"], s, rng); if (o[s] !== "C" || o.length !== 4) { fail = true; console.log("FAIL layout"); } }
// test-wise guessing strategies must stay near chance (25%)
const { report } = await import("./cues.mjs");
const r = report();
for (const [k, v] of Object.entries(r)) {
  if (k === "n") continue;
  const pct = 100 * v;
  console.log(`strategy ${k}: ${pct.toFixed(1)}%`);
  if (pct > 33 || pct < 15) { console.log(`FAIL: strategy ${k} is a usable cue`); fail = true; }
}
for (const q of QUESTIONS) {
  const groups = [];
  if (q.type === "mc") groups.push([q.correct, q.wrong.map(w => w[0])]);
  if (q.type === "tier") groups.push([q.correct, q.wrong], [q.bcorrect, q.bwrong]);
  if (q.type === "odd") groups.push([q.oddOne, q.others], [q.bcorrect, q.bwrong]);
  for (const [c, w] of groups) if (w.includes(c)) { fail = true; console.log("FAIL duplicate answer", q.id); }
}
// order/match sanity
for (const q of QUESTIONS) {
  if (q.type === "order" && new Set(q.steps).size !== q.steps.length) { fail = true; console.log("FAIL dup step", q.id); }
  if (q.type === "match" && new Set(q.pairs.map(p=>p[0])).size !== q.pairs.length) { fail = true; console.log("FAIL dup left", q.id); }
}
console.log(fail ? "TESTS FAILED" : "ALL TESTS PASSED");
process.exit(fail ? 1 : 0);
