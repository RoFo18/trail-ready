// Requirement-tight audit (Nov 2026). Applies every cut, rewrite and move decided in the audit,
// splits La Jolla content into site/regions/la-jolla.js, and writes docs/audit.csv and docs/cuts.md.
// Run once from the repo root: node build/audit.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { BANK as OLD_BANK } from "../site/bank.js";
import { SECTIONS, REQS as OLD_REQS } from "../site/learn.js";

const fnv = (s) => { let h = 0x811c9dc5; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };
const mkid = (r, q) => `${r}-${fnv(r + "|" + q)}`;
const REQS = structuredClone(OLD_REQS);
let bank = structuredClone(OLD_BANK);
const region = { learn: {}, bank: [] };
const cuts = [];   // {r, what, why}
const notes = [];  // corrections with sources

const byId = (id) => { const q = bank.find((x) => x.id === id); if (!q) throw new Error("no " + id); return q; };
const label = (q) => q.q || (q.t === "match" ? "Match: " + q.pairs.map((p) => p[0]).join(", ") : "Order: " + q.steps.join(" > "));
function cut(id, why) { const q = byId(id); cuts.push({ r: q.r, what: label(q), why }); bank = bank.filter((x) => x !== q); }
function toRegion(id) { const q = byId(id); bank = bank.filter((x) => x !== q); region.bank.push(q); }
function edit(id, fn) { fn(byId(id)); }
function add(r, q, afterId) {
  const n = { r, ...q, id: mkid(r, (q.q || "") + (q.a || JSON.stringify(q.pairs || q.steps))) };
  const i = afterId ? bank.findIndex((x) => x.id === afterId) + 1 : bank.length;
  bank.splice(i, 0, n);
}
const card = (k, h) => { const c = REQS[k].learn.find((c) => c.h === h); if (!c) throw new Error(`no card ${k}/${h}`); return c; };
function dropCard(k, h, why) { const c = card(k, h); REQS[k].learn = REQS[k].learn.filter((x) => x !== c); if (why) cuts.push({ r: k, what: `Learn card "${h}"`, why }); }
function cardToRegion(k, h) { const c = card(k, h); REQS[k].learn = REQS[k].learn.filter((x) => x !== c); (region.learn[k] ||= []).push(c); }
function setLine(k, h, oldStart, neu, why) {
  const c = card(k, h); const i = c.p.findIndex((l) => l.startsWith(oldStart)); if (i < 0) throw new Error(`no line ${k}/${h}/${oldStart}`);
  if (neu === null) { if (why) cuts.push({ r: k, what: `Learn line "${c.p[i]}"`, why }); c.p.splice(i, 1); } else c.p[i] = neu;
}
const regionCard = (k, h, p) => (region.learn[k] ||= []).push({ h, p });

// ---------- Leave No Trace (1b)
setLine("lnt", "What they look like out there", "Plan:", "Plan: check the weather and the rules before you go.");
edit("lnt-15jra6t", (q) => { q.q = "Before the trip you check the weather forecast and the park rules. Which principle is that?"; });
add("lnt", { t: "match", q: "Match each action to the Leave No Trace principle it follows.", pairs: [
  ["Checking the weather before you go", "Plan Ahead and Prepare"],
  ["Packing out your orange peels", "Dispose of Waste Properly"],
  ["Leaving pretty rocks where they are", "Leave What You Find"],
  ["Cooking on a stove instead of a fire", "Minimize Campfire Impacts"],
  ["Watching deer from a distance", "Respect Wildlife"]] }, "lnt-1ufkhml");
for (const id of ["lnt-cdcvk7", "lnt-17qgie6", "lnt-s7g5gl", "lnt-7eoact", "lnt-1w2ifgj"]) toRegion(id);
regionCard("lnt", "In the tidepools", ["Step on bare rock, not seaweed or surfgrass. Things live under it.", "Flip a rock? Put it back gently, the same way up.", "Shells and animals stay. In a marine reserve, that's the law.", "No rock towers. Leave the beach the way you found it."]);

// ---------- Campsite (1c)
for (const id of ["campsite-c6tlil", "campsite-tykb6s"]) toRegion(id);
setLine("campsite", "Safe means", "On a beach", null);
regionCard("campsite", "On the coast", ["Pitch above the high-tide line.", "Stay well back from bluff edges."]);
edit("campsite-1fbu7rw", (q) => { q.q = "The wind is strong tonight. How should you set up your tent?"; });
cut("campsite-veepbl", "Same idea as the wind question: stake and guy out every line.");
cut("campsite-q1s3q3", "Same idea as checking overhead for dead limbs; the rattlesnake detail isn't part of choosing a site.");

// ---------- When to use a fire (2a)
const santaAna = structuredClone(byId("whenfire-1inh73k"));
toRegion("whenfire-1inh73k");
add("whenfire", { t: "mc", q: "Hot, dry, gusty winds are blowing and the patrol wants a campfire. What is the right call?", a: "Skip the fire and cook dinner on the stove", w: santaAna.w }, "whenfire-y4uz2q");
toRegion("whenfire-l9r4i");
regionCard("whenfire", "In San Diego", ["Fires only in the rings or grills the site provides.", "Santa Ana winds blowing? No fire. Use the stove."]);
cut("whenfire-e6wkla", "Where firewood is bought isn't part of deciding when a fire is appropriate.");
cut("whenfire-1a9izd5", "Water and shovel ready is taught and tested under building a fire (2c).");
setLine("whenfire", "Yes to a fire when", "Water and a shovel", null);
dropCard("whenfire", "Firewood", "Buying firewood locally isn't needed for 2a; the trash point is kept below.");
card("whenfire", "No fire when").p.push("You just want to burn trash. Pack it out instead.");

// ---------- Knife, tinder, kindling, fuel (2b)
cut("firewood-75ohpv", "The size match already tests tinder, kindling and fuel; ordering them added nothing.");
cut("firewood-jmjbmc", "Repeats the saw-or-axe question, and its Totin' Chip option was misleading.");
card("firewood", "Knife rules").p.push("Only dead and down wood. Never cut live trees.");

// ---------- Build and put out a fire (2c)
cut("buildfire-1vo9m2q", "Knowing one fire lay is enough to build the fire; the shape match covers it.");
edit("buildfire-1bx0rl6", (q) => { q.q = "Why not just bury a fire in sand or dirt to put it out?"; });

// ---------- Knots (2f, 2g)
cut("knots-d0eebf", "Taught the taut-line hitch and two half hitches, which aren't Second Class knots.");
cut("knots-gcdc0b", "The bowline's weak spot isn't part of describing when to use it.");
setLine("knots", "Bowline", "Weak spot", null, "Not needed to describe when to use a bowline.");
cut("knots-cxds7x", "Same situation test as the knot match.");
cut("knots-1135xr9", "Same situation test as the knot match.");

// ---------- Compass and map (3a, 3b)
setLine("compass", "Orient a map, in order. Order matters.", "5. Adjust", "5. Adjust for declination. Your map shows how much.");
edit("compass-eue6ib", (q) => { q.steps[4] = "Adjust for the declination shown on your map"; });
const decl = byId("compass-1mne4rc");
cuts.push({ r: "compass", what: label(decl), why: "San Diego's declination number is local trivia; replaced with what declination means." });
bank = bank.filter((x) => x !== decl);
add("compass", { t: "mc", q: "What is declination?", a: "The gap between true north and magnetic north", w: ["How steep the land is between contour lines", "The angle of the sun at noon", "The error from holding a compass near metal"] }, "compass-vfd2vk");
card("compass", "Bearings").p.unshift("Declination: the gap between true north and magnetic north.");
cut("compass-1jpqj74", "The shoot-a-bearing steps already test this.");
cut("compass-1k78i4r", "The bearing-to-direction match already tests this.");
cut("compass-xtu7vb", "Contour interval isn't one of the map basics the requirement asks for.");
setLine("compass", "Map symbols", "Contour interval", null, "Not needed for the requirement.");

// ---------- Directions without a compass (3d)
cut("nocompass-pcmpwe", "The shadow-stick steps already end with which mark is west.");
dropCard("nocompass", "Watch method", "The shadow stick covers finding direction by day.");
cut("nocompass-1bvfk7o", "Watch method dropped: the shadow stick covers daytime.");
cut("nocompass-1eyqn54", "The Big Dipper is enough to find the North Star.");
cut("nocompass-1mm4flg", "Orion isn't needed; the North Star covers night.");
cut("nocompass-4pspeh", "Where the sun sits mid-afternoon is beyond the requirement.");
setLine("nocompass", "At night", "Dipper too low?", null, "Cassiopeia isn't needed.");
setLine("nocompass", "At night", "Orion rises", null, "Orion isn't needed.");
setLine("nocompass", "The sun", "In the afternoon", null, "Beyond the requirement.");
edit("nocompass-1mn7vc2", (q) => { q.pairs = [["Sunrise", "East"], ["Sunset", "West"], ["North Star", "North"], ["First shadow-stick mark", "West"]]; });

// ---------- Hike hazards (3c)
cardToRegion("hazards", "Coast");
for (const id of ["hazards-5ja8s0", "hazards-18gplh8", "hazards-12om95e"]) toRegion(id);
edit("hazards-b8okxs", (q) => { q.q = "Which is NOT a smart hiking habit?"; q.a = "Shortcutting off the trail to a cliff edge"; });
edit("hazards-1sy3iba", (q) => { q.q = "Match each trail hazard to the habit that prevents it."; q.pairs[2][1] = "Watch your footing on rocks and gravel"; });
card("hazards", "Your body").p.push("Sun: hat, sunscreen, long sleeves.", "Blisters: broken-in boots, dry socks. Stop at the first hot spot.");
add("hazards", { t: "mc", q: "You feel a hot spot on your heel a mile into the hike. What do you do?", a: "Stop and cover it before it becomes a blister", w: ["Keep going; it will go numb soon", "Loosen the boot all the way and keep hiking", "Wait until the end of the hike to check it"] }, "hazards-15sq51s");

// ---------- Safe swim (5a)
cut("safeswim-1dki2yk", "Ability groups were already tested twice.");
const eight = card("safeswim", "The eight points of Safe Swim Defense");
eight.p = ["Qualified supervision: a trained adult is in charge.", "Personal health review: everyone's health form is checked.", "Safe area: depth and hazards checked, areas marked.", "Response personnel: trained rescuers ready to act.", "Lookout: one person watches the whole area.", "Ability groups: nonswimmer, beginner, swimmer.", "Buddy system: everyone has a buddy; buddy checks keep count.", "Discipline: everyone knows the rules and follows them.", "Know all eight. The order isn't the test."];
dropCard("safeswim", "The details they'll ask about");
card("safeswim", "The eight points of Safe Swim Defense").p.splice(7, 0, "Buddy check: buddies grab hands and raise them so the leader can count.");
add("safeswim", { t: "match", q: "Match each point of Safe Swim Defense to what it means.", pairs: [
  ["Qualified supervision", "A trained adult is in charge"], ["Personal health review", "Everyone's health form is checked"],
  ["Safe area", "Depth and hazards checked, areas marked"], ["Response personnel", "Trained rescuers ready to act"],
  ["Discipline", "Everyone knows and follows the rules"]] }, "safeswim-rzo9ky");
cardToRegion("safeswim", "In the ocean");
for (const id of ["safeswim-1qopb7p", "safeswim-1byzyif", "safeswim-1r3c0pr"]) toRegion(id);

// ---------- Reaching and throwing rescues (5c), Why not swim out (5d)
cut("noswim-14v69x5", "Reach, throw, row, go already tests this.");
cut("noswim-wpg7yy", "Reaching tools are already tested under reaching rescues.");

// ---------- First aid (6a)
const bite = card("firstaid", "Animal bite"); bite.h = "Warm-blooded animal bite";
const punct = card("firstaid", "Puncture wounds");
punct.p = ["Splinter: clean tweezers, wash, bandage.", "Nail or other deep puncture: stop any bleeding with gentle pressure, rinse it clean, cover it, and see a doctor about a tetanus shot.", "Fishhook past the barb: leave it for a trained adult or a doctor."];
notes.push({ item: "Nail puncture care", was: "Let it bleed a little, wash, bandage", now: "Stop any bleeding with gentle pressure, rinse it clean, cover it, see a doctor about tetanus", src: "Mayo Clinic, Puncture wounds: First aid (mayoclinic.org/first-aid/first-aid-puncture-wounds/basics/art-20056665)" });
edit("firstaid-1aty0pr", (q) => { q.pairs = [["Splinter", "Remove with clean tweezers, wash and bandage"], ["Stepped on a nail", "Stop bleeding, rinse, cover, see a doctor about tetanus"], ["Fishhook past the barb", "Leave it for a trained adult or doctor"]]; });
regionCard("firstaid", "At the beach", ["Stingray sting: soak the foot in water as hot as the person can stand, then get medical help."]);
toRegion("firstaid-8o861h");
const burn = card("firstaid", "Serious burn, in order"); burn.h = "Second-degree burn (blisters), in order";
burn.p = ["1. Get away from the heat.", "2. Cool it under cool running water for 15 to 20 minutes. No ice.", "3. Cover loosely with a clean, dry dressing.", "4. Treat for shock and get medical help.", "Don't pop the blisters. No butter or creams."];
edit("firstaid-gtuce9", (q) => { q.steps[1] = "Cool under cool running water for 15 to 20 minutes"; q.steps[2] = "Cover loosely with a clean, dry dressing"; });
notes.push({ item: "Burn cooling time", was: "Cool with cool water for at least 10 minutes", now: "Cool under cool running water for 15 to 20 minutes, no ice", src: "American Red Cross, Burns: How to Help (redcross.org/take-a-class/resources/learn-first-aid/burns)" });
edit("firstaid-7h9f21", (q) => { q.q = "Dust blows into a Scout's eye. What do you do first?"; q.w[2] = "Rinse it with a sports drink and keep going"; });
edit("firstaid-150dxbq", (q) => { q.q = "A Scout is bitten by a squirrel he tried to feed. What is the right care?"; });
cut("firstaid-g8bk9u", "The bite question already tests this.");
cut("firstaid-1qatbby", "Recognizing heat exhaustion and heatstroke was already tested twice; replaced with how to treat each.");
add("firstaid", { t: "mc", q: "A Scout has heat exhaustion. What do you do?", a: "Shade, lie down with feet up, cool cloths, sips of water", w: ["Keep hiking slowly so he can cool off in the breeze", "Give him a hot drink and wrap him in a blanket", "Have him do jumping jacks to get the blood moving"] }, "firstaid-1vv9pbn");
add("firstaid", { t: "mc", q: "A Scout has heatstroke: hot, red skin and confused. What do you do?", a: "Call 911 and cool him fast with water", w: ["Let him sleep it off in the tent", "Give him salt tablets and keep going", "Wait an hour to see if it passes"] }, "firstaid-1vv9pbn");
add("firstaid", { t: "mc", q: "How do you help someone who is hyperventilating?", a: "Stay calm and coach slow breaths", w: ["Have them breathe into a plastic bag", "Tell them to hold their breath for a minute", "Give them a sugary drink right away"] }, "firstaid-1oeeuvx");

// ---------- Hurry cases (6b)
const four = card("hurry", "The four hurry cases");
four.p = ["Stopped breathing: call 911, send for an AED, start CPR. Not trained? Hands-only CPR: push hard and fast in the center of the chest.",
  "Severe bleeding: press hard on the wound and keep pressing. Soaked through? Add more cloth on top. No peeking.",
  "Bleeding still life-threatening on an arm or leg? A trained person uses a tourniquet.",
  "Stroke: call 911 and note the time the signs started.",
  "Swallowed poison: call Poison Control or 911. Don't make them throw up unless they tell you to. Keep the container."];
notes.push({ item: "CPR for untrained rescuers", was: "Start CPR if trained", now: "Not trained? Hands-only CPR: push hard and fast in the center of the chest", src: "American Heart Association, Hands-Only CPR (heart.org)" });
notes.push({ item: "Severe bleeding", was: "Direct pressure only", now: "Direct pressure; a trained person adds a tourniquet for life-threatening arm or leg bleeding", src: "2024 AHA and American Red Cross Guidelines for First Aid (professional.heart.org)" });
edit("hurry-17kgg27", (q) => { q.pairs[0][1] = "Call 911; start CPR"; });
cut("hurry-o4yu8q", "Stroke signs were already tested twice.");
cut("hurry-u6gsq7", "Telling the conditions apart is already tested in First aid.");

// ---------- Preventing injuries (6c)
setLine("prevent", "Match the habit to the injury", "Stingray stings", null);
setLine("prevent", "Match the habit to the injury", "Tidepool cuts", null);
regionCard("prevent", "At the beach", ["Stingray stings: shuffle your feet when you wade.", "Tidepool cuts and falls: closed-toe shoes that grip."]);
for (const id of ["prevent-8dtehm", "prevent-1vn2eej"]) toRegion(id);
edit("prevent-1w49mrg", (q) => { q.a = "Hiking off alone to save time"; q.w = ["Using the buddy system the whole time", "Drinking water often", "Wearing gloves to handle firewood"]; });
add("prevent", { t: "mc", q: "Which habit best prevents hypothermia on a campout?", a: "Stay dry and carry a warm layer", w: ["Wear cotton so your skin can breathe", "Skip the rain jacket on sunny mornings", "Sleep on the bare ground to stay cool"] });

// ---------- Emergencies (6d)
setLine("emergency", "In the backcountry, in order", "At the beach", null);
regionCard("emergency", "At the beach", ["The nearest lifeguard tower is often the fastest help. Or call 911."]);
toRegion("emergency-sgong1");
cut("emergency-gjk0r4", "Why responders need each detail goes beyond what to tell them.");

// ---------- Flag ceremony (8a) and flag respect (8b)
for (const id of ["ceremony-s9yj6y", "ceremony-176cbtz"]) cut(id, "The ceremony order already tests this.");
cut("ceremony-128mz02", "The Memorial Day rule is a detail, not the core respect due the flag.");
const det = card("ceremony", "The details");
det.p = det.p.filter((l) => !/^With other flags|^On a stage/.test(l));
for (const id of ["ceremony-1rz706p", "ceremony-13dgwz", "ceremony-41rllf", "ceremony-1w5s1ph"]) { const q = byId(id); q.r = "flag"; }
add("ceremony", { t: "mc", q: "How does the Pledge of Allegiance start?", a: "I pledge allegiance", w: ["I pledge of allegiance", "I pledge my allegiance", "We pledge allegiance"] }, "ceremony-1phlqvj");
const fl = card("flag", "The stuff people get wrong");
fl.p = fl.p.filter((l) => !/^Memorial Day/.test(l));
fl.p.unshift("Flag raised, lowered or carried past you: stand at attention and salute.");
fl.p.push("With other flags, the US flag goes on its own right, or in front.", "On a stage, it stands on the speaker's right.");
add("flag", { t: "mc", q: "The flag is carried past you in a parade. What do you do?", a: "Stand at attention and salute until it passes", w: ["Keep walking so you don't block anyone's view", "Wave at the color guard as it goes by", "Sit back down once you've seen it"] }, "flag-1s62e8w");

// ---------- Three R's (9a)
edit("threer-1naqsir", (q) => { q.q = "An adult you met online offers you a gift and says, 'Don't tell your parents.' What is that?"; q.a = "A warning sign to tell a trusted adult about"; q.w = ["A nice surprise to keep between you two", "Normal, since it's only a gift", "Something to share only with your friends"]; });

// ---------- Wild animals (4)
cardToRegion("animals", "Tidepool animals");
cardToRegion("animals", "Along the coast");
dropCard("animals", "Tidepool zones, top to bottom", "Tidepool zones aren't needed to identify ten animals.");
cut("animals-1axdq22", "Tidepool zones aren't needed to identify ten animals.");
cut("animals-79wd8b", "Hermit crab biology; the photo question already covers identifying it.");
cut("animals-ejgbjn", "The two-spot octopus photo question already covers it.");
cut("animals-q1khvs", "The sea lion photo and the coast match already cover it.");
cut("animals-fsewbf", "The urchin photo and match already cover it.");
edit("animals-uh7q3m", (q) => { q.q = "Which one is NOT real evidence that you found an animal yourself?"; q.a = "A photo of the animal from a website"; q.w = ["Tracks you found and photographed", "An empty shell or molt you found", "Your own photo of the animal"]; });
const id2 = card("animals", "How to ID an animal");
id2.p[1] = "A different kind means a different type, like a crow versus a hawk.";
edit("animals-k5g9gg", (q) => { q.a = "A different type, like a crow versus a hawk"; });
for (const q of bank.filter((q) => q.r === "animals" && !["animals-k5g9gg", "animals-uh7q3m"].includes(q.id))) toRegion(q.id);
const coast = region.learn.animals.find((c) => c.h === "Along the coast");
coast.p = coast.p.map((l) => l.startsWith("Stay at least 50 yards") ? "Give sea lions and seals lots of room. Never approach. They bite, and they win." : l);
const dist = region.bank.find((q) => q.id === "animals-aezygj");
dist.q = "How close should you get to the sea lions at La Jolla Cove?"; dist.a = "Stay well back; never approach them";
dist.w = ["Close enough to pet them, if they are sleeping", "About five feet, as long as you move slowly", "As close as you want if a pup is alone"];
notes.push({ item: "Sea lion distance", was: "At least 50 yards", now: "Stay well back; never approach (number dropped as trivia)", src: "NOAA Fisheries marine mammal viewing guidelines" });


// ---------- Write files
const header = `// Sections, requirements and what to learn for each. Core content: works anywhere in the country.
// Location-specific content lives in site/regions/. Voice: a down-to-earth junior high teacher.
// A card is { h: heading, p: [lines], img? }. "before" holds knowledge the requirement depends on.
// Generated by build/audit.mjs from the audited content; edit here directly from now on.
`;
writeFileSync("site/learn.js", header + "export const SECTIONS = " + JSON.stringify(SECTIONS, null, 1) + ";\n\nexport const REQS = " + JSON.stringify(REQS, null, 1) + ";\n");
writeFileSync("site/bank.js", "// Core question bank. Types: mc (a = answer, w = wrong), order (steps in order), match (pairs).\nexport const BANK = " + JSON.stringify(bank, null, 1) + ";\n");
mkdirSync("site/regions", { recursive: true });
writeFileSync("site/regions/la-jolla.js", "// La Jolla region: local examples, hazards and the wild animals for requirement 4.\nexport const REGION = " + JSON.stringify({ id: "la-jolla", name: "La Jolla", learn: region.learn, bank: region.bank }, null, 1) + ";\n");

const reqOf = { lnt: "1b", campsite: "1c", whenfire: "2a", firewood: "2b", buildfire: "2c", stoves: "2d", knots: "2f/2g", compass: "3a/3b", hazards: "3c", nocompass: "3d", animals: "4", safeswim: "5a", rescue: "5c", noswim: "5d", firstaid: "6a", hurry: "6b", prevent: "6c", emergency: "6d", vehicle: "6e", ceremony: "8a", flag: "8b", threer: "9a", bullying: "9b" };
writeFileSync("docs/cuts.md", "# Cut in the Nov 2026 audit\n\n" + Object.keys(reqOf).map((k) => {
  const c = cuts.filter((x) => x.r === k); return c.length ? `## ${reqOf[k]} ${OLD_REQS[k].name}\n` + c.map((x) => `- ${x.what}: ${x.why}`).join("\n") + "\n" : "";
}).join("\n") + "\n# Safety facts corrected\n\n" + notes.map((n) => `- ${n.item}. Was: ${n.was}. Now: ${n.now}. Source: ${n.src}.`).join("\n") + "\n");
console.log("core", bank.length, "region", region.bank.length, "cuts", cuts.length);
