// Trim pass: keep only what the Second Class requirements need, require order only where order matters,
// and add knot photo questions. Run once: node build/trim.mjs (rewrites site/bank.js).
import { writeFileSync } from "node:fs";
import { BANK } from "../site/bank.js";

const fnv = (s) => { let h = 0x811c9dc5; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };
const id = (r, q) => `${r}-${fnv(r + "|" + q)}`;

const SHEET = { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Sheet_Bend_-_ABoK_1431_-_USCG.jpg/960px-Sheet_Bend_-_ABoK_1431_-_USCG.jpg", credit: "Photo: USCG, CC0, via Wikimedia Commons", ratio: "5 / 2", pos: "50% 61%" };
const BOWLINE = { src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Knot-bowline-ABoK_1010-USCG.jpg/960px-Knot-bowline-ABoK_1010-USCG.jpg", credit: "Photo: USCG, CC BY-SA 4.0, via Wikimedia Commons", ratio: "16 / 9", pos: "62% 53%" };

// Not needed for the requirement, technique the Scout learns by hand, or ordering where order isn't the point.
const DROP = new Set([
  "firewood-gtqiwe",   // why tinder is thin
  "buildfire-1p1ecrf", // fire triangle
  "buildfire-1xu51pv", // why gaps
  "stoves-ac1wtd",     // cold canister pressure
  "stoves-158jis7",    // windscreen
  "knots-1sxgnfa",     // which rope makes the bend (tying)
  "knots-1o61zy0",     // checking a finished sheet bend (tying)
  "compass-17wlycf",   // following a bearing, in order
  "threer-6mnm9f",     // three R's in order
  "animals-11l843s",   // ID questions in order
]);

// Order questions that become something else.
const REPLACE = {
  "lnt-1nzvn69": [
    { t: "mc", q: "Which of these is one of the seven Leave No Trace principles?", a: "Leave What You Find", w: ["Take Only Pictures", "Stay Together Always", "Cook Only on Stoves"] },
    { t: "mc", q: "Which is NOT one of the seven Leave No Trace principles?", a: "Always Hike in Groups of Four", w: ["Dispose of Waste Properly", "Minimize Campfire Impacts", "Be Considerate of Other Visitors"] },
  ],
  "campsite-19qvj47": [
    { t: "mc", q: "You're sizing up a campsite. Which question matters least?", a: "Is it comfortable?", w: ["Is camping allowed here?", "Is it safe from floods and falling limbs?", "Is the ground durable?"] },
  ],
  "safeswim-1kgwd0a": [
    { t: "mc", q: "Which is one of the eight points of Safe Swim Defense?", a: "Ability groups", w: ["Water temperature", "Swim fins", "Snack breaks"] },
    { t: "mc", q: "Swimmers are split into nonswimmer, beginner and swimmer areas. Which point of Safe Swim Defense is that?", a: "Ability groups", w: ["Safe area", "Buddy system", "Qualified supervision"] },
  ],
  "rescue-p4cd2f": [
    { t: "mc", q: "Before you reach out to someone in the water, what do you do?", a: "Get low: lie down or brace on solid ground", w: ["Stand at the very edge so your reach is longer", "Wade in to your knees to get a little closer", "Take off your shoes in case you need to swim"] },
  ],
};

const ADD = {
  "buildfire-1onx3ia": [
    { t: "mc", q: "The fire is cold out. What do you do with the ashes?", a: "Leave or scatter them the way the site's rules say", w: ["Dump them, still warm, in the campground trash can", "Bury them under sand while they're still warm", "Sweep them into the creek so they cool off faster"] },
  ],
  "knots-1vfafk2": [
    { t: "mc", q: "Which knot is this?", img: SHEET, a: "Sheet bend", w: ["Bowline", "Square knot", "Clove hitch"] },
    { t: "mc", q: "Which knot is this?", img: BOWLINE, a: "Bowline", w: ["Sheet bend", "Taut-line hitch", "Two half hitches"] },
  ],
};

const FIX = {
  "campsite-veepbl": (q) => { q.a = "Wind can come up hard at night"; },
};

const out = [];
for (const q of BANK) {
  if (DROP.has(q.id)) continue;
  if (FIX[q.id]) FIX[q.id](q);
  if (REPLACE[q.id]) { REPLACE[q.id].forEach((n) => out.push({ r: q.r, ...n, id: id(q.r, n.q + (n.a || "")) })); continue; }
  out.push(q);
  (ADD[q.id] || []).forEach((n) => out.push({ r: q.r, ...n, id: id(q.r, n.q + (n.a || "")) }));
}
for (const k of [...DROP, ...Object.keys(REPLACE), ...Object.keys(ADD), ...Object.keys(FIX)])
  if (!BANK.some((q) => q.id === k)) throw new Error("missing " + k);
if (new Set(out.map((q) => q.id)).size !== out.length) throw new Error("duplicate ids");

writeFileSync(new URL("../site/bank.js", import.meta.url),
  "// Question bank: one question per item. Types: mc (a = answer, w = wrong), order (steps in order), match (pairs).\nexport const BANK = " + JSON.stringify(out, null, 1) + ";\n");
console.log(BANK.length, "->", out.length, "questions;", out.filter((q) => q.t === "order").length, "ordering");
