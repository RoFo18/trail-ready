// Simulates test-wise guessing strategies against the multiple-choice bank.
// A fair bank keeps each strategy near chance (25% with 4 options).
import { BANK } from "../site/content.js";
const ABS = /\b(always|never|only|every|all|none|completely|exactly|must)\b/i;
export function report() {
  const S = BANK.filter((q) => q.t === "mc").map((q) => [q.a, ...q.w]);
  const strat = (f) => {
    let s = 0;
    for (const all of S) { const v = all.map(f); const m = Math.max(...v); const k = v.filter((x) => x === m).length; if (v[0] === m) s += 1 / k; }
    return s / S.length;
  };
  let mid = 0;
  for (const all of S) {
    const L = all.map((x) => x.length); const so = [...L].sort((a, b) => a - b); const med = (so[1] + so[2]) / 2;
    const d = L.map((v) => -Math.abs(v - med)); const m = Math.max(...d); const k = d.filter((x) => x === m).length; if (d[0] === m) mid += 1 / k;
  }
  return {
    pickLongest: strat((x) => x.length), pickShortest: strat((x) => -x.length),
    pickMostWords: strat((x) => x.split(/\s+/).length), avoidAbsolutes: strat((x) => (ABS.test(x) ? 0 : 1)),
    pickAbsolutes: strat((x) => (ABS.test(x) ? 1 : 0)), pickMiddleLength: mid / S.length,
  };
}
