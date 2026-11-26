// One-time conversion: old question bank -> new single-question bank (mc, order, match).
import { QUESTIONS } from "../site/data.js";
import { writeFileSync } from "fs";
const KEEP = ["2C-1b","2C-1c","2C-2a","2C-2b","2C-2c","2C-2d","2C-2f","2C-2g","2C-3a","2C-3c","2C-3d","2C-4","2C-5a","2C-5c","2C-5d","2C-6a","2C-6b","2C-6c","2C-6d","2C-6e","2C-8a","2C-8b","2C-9a","2C-9b"];
const kept = QUESTIONS.filter(q => KEEP.includes(q.req));
const DROP = new Set([4,11,13,21,27,41,61,76,78,84,85,88,90,93,95,96,97,119,124,126,156,157,160,169,170,172,176,177,183,192,200,202,204,206,207,208,212,216,217,218,219,221,224,238,239,240]);
const EDIT = {
  171: "The flattest, softest tent spot is in a dry sandy wash. Is it a good spot?",
  173: "Why stake and guy out a tent even on a calm afternoon?",
  174: "Your tent spot is right under a big rock overhang. What's the concern?",
  175: "The night will drop below freezing. How does that change your tent spot?",
  187: "On a freezing morning, your canister stove gives only a weak flame. Why?",
};
// New requirement keys (no numbers shown anywhere)
const KEY = {"2C-1b":"lnt","2C-1c":"campsite","2C-2a":"whenfire","2C-2b":"firewood","2C-2c":"buildfire","2C-2d":"stoves","2C-2f":"knots","2C-2g":"knots","2C-3a":"compass","2C-3c":"hazards","2C-3d":"nocompass","2C-4":"animals","2C-5a":"safeswim","2C-5c":"rescue","2C-5d":"noswim","2C-6a":"firstaid","2C-6b":"hurry","2C-6c":"prevent","2C-6d":"emergency","2C-6e":"vehicle","2C-8a":"ceremony","2C-8b":"flag","2C-9a":"threer","2C-9b":"bullying"};
const out = [];
kept.forEach((q, i) => {
  const n = i + 1;
  if (DROP.has(n)) return;
  const text = EDIT[n] || q.q;
  const r = KEY[q.req];
  if (q.type === "mc") out.push({ r, t: "mc", q: text, a: q.correct, w: q.wrong.map(x => Array.isArray(x) ? x[0] : x), ...(q.img ? { img: q.img } : {}) });
  else if (q.type === "tier") out.push({ r, t: "mc", q: text, a: q.correct, w: q.wrong });
  else if (q.type === "odd") out.push({ r, t: "mc", q: text, a: q.oddOne, w: q.others });
  else if (q.type === "order") out.push({ r, t: "order", q: text, steps: q.steps });
  else if (q.type === "match") out.push({ r, t: "match", q: text, pairs: q.pairs });
  else console.error("skip", n, q.type);
});
const bad = out.filter(o => /joshua|cholla|santa ana/i.test(JSON.stringify(o)));
bad.forEach(b => console.error("CHECK", JSON.stringify(b).slice(0, 200)));
const c = {}; out.forEach(o => c[o.r] = (c[o.r] || 0) + 1);
console.error(out.length, JSON.stringify(c));
writeFileSync("/home/claude/trail-ready/build/bank.json", JSON.stringify(out, null, 1));
