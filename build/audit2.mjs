// Second audit pass: applies the independent reviewer's findings. Run once: node build/audit2.mjs
import { writeFileSync, readFileSync } from "node:fs";
import { BANK as CORE } from "../site/bank.js";
import { SECTIONS, REQS } from "../site/learn.js";
import { REGION } from "../site/regions/la-jolla.js";

let core = structuredClone(CORE), reg = structuredClone(REGION);
const cuts = [], notes = [];
const label = (q) => q.q || (q.t === "match" ? "Match: " + q.pairs.map((p) => p[0]).join(", ") : "Order: " + q.steps.join(" > "));
const find = (id) => core.find((q) => q.id === id) || reg.bank.find((q) => q.id === id) || (() => { throw new Error("no " + id); })();
function cut(id, why) { const q = find(id); cuts.push({ r: q.r, what: label(q), why }); core = core.filter((x) => x !== q); reg.bank = reg.bank.filter((x) => x !== q); }
const edit = (id, fn) => fn(find(id));
const cards = (k, region) => (region ? reg.learn[k] : REQS[k].learn);
const card = (k, h, region) => cards(k, region).find((c) => c.h === h) || (() => { throw new Error(`no card ${k}/${h}`); })();
function line(k, h, start, neu, region) {
  const c = card(k, h, region); const i = c.p.findIndex((l) => l.startsWith(start)); if (i < 0) throw new Error(`no line ${k}/${h}/${start}`);
  if (neu === null) c.p.splice(i, 1); else c.p[i] = neu;
}

// TRACE
cut("campsite-1fbu7rw", "Staking and guying is pitching technique, not choosing the site.");
line("campsite", "Layout and weather", "Door away", "Door away from the wind.");
cut("campsite-1ri2t3l", "Cold-air pooling isn't part of what the requirement asks.");
line("campsite", "Layout and weather", "Cold night?", null);
cut("whenfire-y4uz2q", "Burning trash isn't one of the when-to-have-a-fire conditions.");
line("whenfire", "No fire when", "You just want to burn trash", null);
cut("firewood-f4xgmg", "Prying isn't one of the core knife safety rules.");
line("firewood", "Knife rules", "It's a knife", null);
cut("buildfire-nmy147", "Knowing one fire lay is enough to build the fire; the card stays as a how-to.");
cut("compass-608u6v", "Reading contour spacing goes beyond identifying map symbols.");
line("compass", "Map symbols", "Brown contour lines", "Brown contour lines: elevation.");
cut("hurry-18j6a0m", "The warning-stroke detail goes beyond recognize, note the time, call 911.");
line("hurry", "Stroke signs", "Signs went away?", null);
line("threer", "Red flags", "In Scouting, no adult", null);
cut("safeswim-1byzyif", "Shuffling for stingrays is injury prevention; it's already under Preventing injuries.");
line("safeswim", "In the ocean", "Stingrays", null, true);
reg.learn.animals.push({ h: "Signs they leave", p: ["Urchin test: a round shell with no spines, left after an urchin dies.", "A whole empty crab shell: the crab molted to grow.", "Strong smell and barking on the rocks: sea lions.", "White streaks on cliff rocks: pelicans and cormorants roosting.", "Tiny jumping bugs under washed-up kelp: beach hoppers."] });

// DUPLICATE
cut("lnt-1ufkhml", "Same idea as 'Which is one of the seven principles?'.");
edit("lnt-1llkqua", (q) => { q.pairs = q.pairs.filter((p) => !p[0].startsWith("Checking the weather")); });
cut("whenfire-1inh73k", "Same as the core hot, dry wind question.");
cut("knots-hnhihm", "The knot match already covers joining a thin cord to a thick rope.");
cut("knots-1cwdjda", "The knot match already covers a rescue loop around a chest.");
edit("knots-1vfafk2", (q) => { q.pairs = [["Tying a rope around a friend's chest to pull him from the water", "Bowline"], ["Adding a thin cord to make a clothesline longer", "Sheet bend"], ["Tying a loop around a tree for a hammock", "Bowline"], ["Joining two ropes of different sizes", "Sheet bend"]]; });
line("knots", "Sheet bend", "Use it to add", "Use it to add a thin cord to a thicker rope to make a longer line.");
cut("hazards-18gplh8", "Same idea as 'Sneaker wave' in the coastal hazard match.");
cut("hazards-12om95e", "Same idea as 'Rising tide' in the coastal hazard match.");
for (const id of ["animals-34xr9v", "animals-1g60yeu", "animals-u3nrvt"]) cut(id, "The same animals are identified from photos.");
cut("rescue-13b7r28", "The throw-bag question already tests aiming past the person.");
cut("hurry-fxlexn", "The hurry-case match already tests direct pressure.");
cut("ceremony-5l6vtu", "The opening ceremony order already tests when the salute starts and stops.");
cut("flag-1s62e8w", "The half-staff steps already test up briskly, down slowly.");
cut("threer-13d1694", "The three R's match already tests Resist.");

// SAFETY
const hypo = card("firstaid", "Hypothermia, in order");
hypo.p = ["Wet plus wind chills you fast, even on a nice day.", "Confused, stumbling or stopped shivering? Call 911 first.", "1. Get out of wind and wet.", "2. Change into dry clothes.", "3. Sleeping bag, off the cold ground.", "4. Warm, sweet drink if fully alert."];
edit("firstaid-ciisvy", (q) => { q.steps = q.steps.filter((s) => !s.startsWith("Get medical help")); });
notes.push({ item: "Hypothermia", was: "Medical help listed last", now: "Severe signs (confused, stumbling, stopped shivering): call 911 first", src: "American Red Cross, Hypothermia (redcross.org/take-a-class/resources/learn-first-aid/hypothermia)" });
edit("hurry-u0xz5c", (q) => { q.q = "Someone collapses and isn't breathing. Put the steps in order."; });
const nb = card("hurry", "Not breathing, in order");
nb.p.push("Pulled from the water? Trained rescuers give rescue breaths with the compressions.");
notes.push({ item: "CPR after drowning", was: "Compressions only, in a water rescue scenario", now: "General collapse scenario; drowning note: trained rescuers give breaths with compressions", src: "American Heart Association, CPR with rescue breaths vital after drowning, Nov 2024 (heart.org)" });

// WRONG-ANSWER
const eight = card("safeswim", "The eight points of Safe Swim Defense");
eight.p = eight.p.filter((l) => !l.startsWith("Buddy check"));
line("safeswim", "The eight points of Safe Swim Defense", "Buddy system", "Buddy system: everyone has a buddy. At a buddy check, buddies grab hands and raise them so the leader can count.");

// ORDER
edit("stoves-1xmmmcv", (q) => { q.steps = ["Outdoors on flat ground, fittings checked, adult's OK", "Strike the match first", "Open the valve slowly and light the burner", "Never leave it; shut off fuel and let it cool"]; });
card("stoves", "Set up and light, in order. Order matters here.").p = ["1. Outdoors, flat ground, fittings tight, an adult's OK.", "2. Strike the match first.", "3. Then open the valve slowly and light it.", "4. Never walk away from it. When you're done, fuel off and let it cool."];
edit("buildfire-rreqm0", (q) => { q.steps = ["Check the rules and use the fire ring", "Water, shovel, tinder, kindling and fuel all ready", "Light the tinder, add kindling, then fuel", "Drown, stir and drown again until cold"]; });
card("buildfire", "In order. This one matters.").p = ["1. Check the rules and use the fire ring.", "2. Have water, a shovel, tinder, kindling and fuel all ready.", "3. Light the tinder, add kindling, then fuel.", "4. Drown, stir, drown again until it's cold.", "5. Ashes: leave them in the ring or scatter them, whatever the site rules say."];
edit("compass-eue6ib", (q) => { q.steps = ["Set the compass to north, adjusted for your map's declination", "Lay the compass edge along a north-south line on the flat map", "Turn map and compass together until the red needle is in the orienting arrow"]; });
card("compass", "Orient a map, in order. Order matters.").p = ["1. Set the compass to north, adjusted for the declination your map shows.", "2. Lay its edge along a north-south line on the flat map.", "3. Turn map and compass together until red is in the shed.", "No compass? Turn the map until landmarks line up with what you see."];
edit("firstaid-1aqntuy", (q) => { q.steps = ["Make sure the scene is safe; call for help", "Have the person lie down", "Raise the feet about 12 inches if it doesn't hurt", "Keep them warm, give nothing to eat or drink, keep checking"]; });
card("firstaid", "Shock, in order").p = ["1. Make sure the scene is safe; call for help.", "2. Have the person lie down.", "3. Raise the feet about 12 inches if it doesn't hurt.", "4. Keep them warm. Nothing to eat or drink. Keep checking on them."];
cut("vehicle-1w2cijc", "Only staying off the road has to come first; the rest depends on the scene.");
const veh = card("vehicle", "In order"); veh.h = "What to do";
veh.p = ["Stay well off the road, away from traffic. That comes first.", "Call 911 with the location and what you see.", "Warn other drivers only if it's safe.", "Let adults lead. First aid only if you're trained.", "Stay and tell responders what you saw."];

// GAP
card("campsite", "Safe means").p.push("Use an established site when you can, about 200 feet from lakes and streams.");
card("stoves", "Which stove").p.unshift("Use a stove instead of a fire when fires aren't allowed, wood is scarce, or you want less impact. It's faster, too.");
card("stoves", "Don't be that Scout").p.push("Keep it away from tents, and keep spare fuel away from the flame.");
card("hazards", "Trail").p.push("Water crossings: find a shallow, slow spot. Fast water above your knees? Don't cross.", "Darkness: carry a headlamp and plan to be back before dark.");
card("prevent", "Match the habit to the injury").p.push("Eye injuries: stand back from chopping and campfire sparks.", "Dehydration: drink often, before you're thirsty.", "Poisoning: fuel and chemicals stay in labeled containers, away from food.", "Drowning: Safe Swim Defense and a buddy, every time.");

writeFileSync("site/learn.js", readFileSync("site/learn.js", "utf8").split("export const SECTIONS")[0] + "export const SECTIONS = " + JSON.stringify(SECTIONS, null, 1) + ";\n\nexport const REQS = " + JSON.stringify(REQS, null, 1) + ";\n");
writeFileSync("site/bank.js", readFileSync("site/bank.js", "utf8").split("export const BANK")[0] + "export const BANK = " + JSON.stringify(core, null, 1) + ";\n");
writeFileSync("site/regions/la-jolla.js", readFileSync("site/regions/la-jolla.js", "utf8").split("export const REGION")[0] + "export const REGION = " + JSON.stringify(reg, null, 1) + ";\n");
const names = Object.fromEntries(Object.entries(REQS).map(([k, r]) => [k, r.name]));
let md = readFileSync("docs/cuts.md", "utf8");
md = md.replace("# Safety facts corrected", "## Cut after independent review\n" + cuts.map((x) => `- ${names[x.r]}. ${x.what}: ${x.why}`).join("\n") + "\n\n# Safety facts corrected");
md += notes.map((n) => `\n- ${n.item}. Was: ${n.was}. Now: ${n.now}. Source: ${n.src}.`).join("") + "\n";
writeFileSync("docs/cuts.md", md);
console.log("core", core.length, "region", reg.bank.length, "cut", cuts.length);
