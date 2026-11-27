// Third audit pass: second reviewer's findings. Run once: node build/audit3.mjs
import { writeFileSync, readFileSync } from "node:fs";
import { BANK as CORE } from "../site/bank.js";
import { SECTIONS, REQS } from "../site/learn.js";
import { REGION } from "../site/regions/la-jolla.js";
let core = structuredClone(CORE), reg = structuredClone(REGION);
const cuts = [];
const fnv = (s) => { let h = 0x811c9dc5; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };
const label = (q) => q.q || "Match/order";
const find = (id) => core.find((q) => q.id === id) || reg.bank.find((q) => q.id === id) || (() => { throw new Error("no " + id); })();
function cut(id, why) { const q = find(id); cuts.push(`- ${REQS[q.r].name}. ${label(q)}: ${why}`); core = core.filter((x) => x !== q); reg.bank = reg.bank.filter((x) => x !== q); }
const card = (list, h) => list.find((c) => c.h === h) || (() => { throw new Error("no card " + h); })();

// Shock: feet up only without suspected injury; order wasn't critical past lying down.
const shock = card(REQS.firstaid.learn, "Shock, in order"); shock.h = "Shock";
shock.p = ["Make sure the scene is safe; call for help.", "Have the person lie down.", "Raise the feet about 12 inches, unless you suspect a head, neck, back or leg injury.", "Keep them warm. Nothing to eat or drink. Keep checking on them."];
cut("firstaid-1aqntuy", "Past having them lie down, the shock steps can happen in any order.");
core.push({ r: "firstaid", t: "mc", q: "When should you NOT raise the feet of someone in shock?", a: "When you suspect a head, neck, back or leg injury", w: ["When the person is lying on the ground", "When the person says they feel cold", "When someone has already called for help"], id: "firstaid-" + fnv("firstaid|feetshock") });

// Stingray and tidepool cuts aren't 6a/6b conditions.
cut("firstaid-8o861h", "A stingray sting isn't one of the conditions in 6a.");
cut("prevent-1vn2eej", "6c covers only the 6a and 6b injuries; stingray stings aren't one.");
cut("prevent-8dtehm", "Cuts and falls aren't among the 6a and 6b injuries.");
delete reg.learn.firstaid; delete reg.learn.prevent;

// Duplicates
cut("lnt-cdcvk7", "Repeats the core Leave No Trace match.");
const sun = find("nocompass-1mn7vc2"); sun.pairs = sun.pairs.filter((p) => !p[0].startsWith("First shadow"));
const coast = find("hazards-5ja8s0"); coast.pairs = coast.pairs.filter((p) => !p[0].startsWith("Crumbling"));

// Wrong answer that was arguably right
const two = find("emergency-vtr4jl"); two.w = two.w.map((w) => w.startsWith("No one may hike alone") ? "Rescuers answer only groups of two" : w);

// Gaps
card(REQS.campsite.learn, "Safe means").p.push("Water nearby to use, and ground that drains so rain doesn't pool under the tent.");
card(REQS.buildfire.learn, "Minimum impact").p.unshift("No ring? Use a fire pan where allowed. Clear anything that can burn away from the fire.");
REQS.ceremony.learn.splice(2, 0, { h: "On a flagpole", p: ["Two Scouts attach the flag to the rope. Others keep it off the ground.", "Raise it briskly. Lower it slowly into waiting hands.", "Fold it before it's carried away."] });

writeFileSync("site/learn.js", readFileSync("site/learn.js", "utf8").split("export const SECTIONS")[0] + "export const SECTIONS = " + JSON.stringify(SECTIONS, null, 1) + ";\n\nexport const REQS = " + JSON.stringify(REQS, null, 1) + ";\n");
writeFileSync("site/bank.js", readFileSync("site/bank.js", "utf8").split("export const BANK")[0] + "export const BANK = " + JSON.stringify(core, null, 1) + ";\n");
writeFileSync("site/regions/la-jolla.js", readFileSync("site/regions/la-jolla.js", "utf8").split("export const REGION")[0] + "export const REGION = " + JSON.stringify(reg, null, 1) + ";\n");
let md = readFileSync("docs/cuts.md", "utf8");
md = md.replace("# Safety facts corrected", "## Cut after second review\n" + cuts.join("\n") + "\n\n# Safety facts corrected");
md += "\n- Shock position. Was: raise the feet if it doesn't hurt. Now: raise the feet unless you suspect a head, neck, back or leg injury. Source: American Red Cross, Shock (redcross.org/take-a-class/resources/learn-first-aid/shock); Scouts BSA Handbook.\n";
writeFileSync("docs/cuts.md", md);
console.log("core", core.length, "region", reg.bank.length);
