// Measures how well "test-wise" guessing strategies would score.
// A fair bank keeps every strategy near chance (25% with 4 options).
import { QUESTIONS } from "../site/questions.js";
export function sets() {
  const out = [];
  for (const q of QUESTIONS) {
    if (q.type === "mc") out.push({ id: q.id, c: q.correct, w: q.wrong.map((x) => x[0]) });
    if (q.type === "tier") { out.push({ id: q.id, c: q.correct, w: q.wrong }); out.push({ id: q.id + "b", c: q.bcorrect, w: q.bwrong }); }
    if (q.type === "odd") { out.push({ id: q.id, c: q.oddOne, w: q.others }); out.push({ id: q.id + "b", c: q.bcorrect, w: q.bwrong }); }
  }
  return out;
}
const ABS = /\b(always|never|only|every|all|none|completely|exactly|must)\b/i;
// Expected score of a strategy that picks the option(s) maximizing f, ties split.
function strategy(S, f) {
  let score = 0;
  for (const s of S) {
    const all = [s.c, ...s.w];
    const vals = all.map(f);
    const best = Math.max(...vals);
    const winners = vals.filter((v) => v === best).length;
    if (vals[0] === best) score += 1 / winners;
  }
  return score / S.length;
}
export function report() {
  const S = sets();
  const words = (s) => s.split(/\s+/).length;
  const r = {
    n: S.length,
    pickLongest: strategy(S, (x) => x.length),
    pickShortest: strategy(S, (x) => -x.length),
    pickMostWords: strategy(S, words),
    avoidAbsolutes: strategy(S, (x) => (ABS.test(x) ? 0 : 1)),
    pickAbsolutes: strategy(S, (x) => (ABS.test(x) ? 1 : 0)),
    pickMiddleLength: strategy(S, (x) => 0), // baseline: pure chance
  };
  // middle-length guesser: pick the option closest to the median length
  let mid = 0;
  for (const s of S) {
    const all = [s.c, ...s.w].map((x) => x.length);
    const sorted = [...all].sort((a, b) => a - b);
    const med = (sorted[1] + sorted[2]) / 2;
    const d = all.map((v) => -Math.abs(v - med));
    const best = Math.max(...d);
    const winners = d.filter((v) => v === best).length;
    if (d[0] === best) mid += 1 / winners;
  }
  r.pickMiddleLength = mid / S.length;
  return r;
}
if (process.argv[1] && process.argv[1].endsWith("cues.mjs")) {
  const r = report();
  for (const [k, v] of Object.entries(r)) console.log(k.padEnd(18), typeof v === "number" && v < 1.01 ? (100 * v).toFixed(1) + "%" : v);
}
