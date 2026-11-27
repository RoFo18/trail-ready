// La Jolla animals: only ones a kid can find easily on a walk, especially at low tide. Run once.
import { writeFileSync, readFileSync } from "node:fs";
import { REGION } from "../site/regions/la-jolla.js";
const reg = structuredClone(REGION);
const fnv = (s) => { let h = 0x811c9dc5; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };
const W = (file, credit) => ({ src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/" + file, credit: "Photo: " + credit + ", via Wikimedia Commons" });
const signs = reg.learn.animals.find((c) => c.h === "Signs they leave");
signs.p = signs.p.filter((l) => !l.startsWith("Urchin test"));
reg.learn.animals = [
  { h: "Getting your ten", p: ["Go at low tide. A minus tide is best. Check the tide chart first.", "The Cove walk gets you six without trying. The tidepools get you the rest.", "Take your own photo of each one. That's your evidence."] },
  { h: "On the Cove walk, any tide", p: [
    "California sea lion: ear flaps, barks, walks on its flippers.",
    "Harbor seal: no ear flaps, spotted, scoots on its belly. Look at the Children's Pool.",
    "Brown pelican: huge bill with a pouch.",
    "Brandt's cormorant: black seabird with a long neck, packed onto the cliffs.",
    "Western gull: big white gull with a dark gray back and a yellow bill.",
    "California ground squirrel: speckled gray-brown, popping out of the ice plant by the walkway.",
    "Give sea lions and seals lots of room. Never approach. They bite, and they win."] },
  { h: "In the tidepools, at low tide", p: [
    "Aggregating anemone: carpets of small anemones covered in sand and bits of shell.",
    "Giant green anemone: big, green, soft tentacles in the low pools.",
    "Striped shore crab: dark with green stripes, runs sideways into cracks.",
    "Hermit crab: small crab living in a borrowed snail shell.",
    "Owl limpet: big, low cone stuck tight to the rock.",
    "Black turban snail: dark, rounded, coiled. Usually lots of them.",
    "California mussel: blue-black paired shells packed in beds.",
    "Gooseneck barnacle: on rubbery stalks, in clumps.",
    "Acorn barnacle: tiny white volcano-shaped shells crusting the rocks.",
    "California sea hare: big, soft, brown slug that squirts purple ink. Spring and summer."] },
  signs,
];
const drop = new Set(["animals-1lo4glf", "animals-1hh2316", "animals-163v8pp", "animals-1yaaevn", "animals-1otelg"]);
reg.bank = reg.bank.filter((q) => !drop.has(q.id));
const m = reg.bank.find((q) => q.id === "animals-1nlz2k0"); m.pairs = m.pairs.filter((p) => !/urchin/i.test(p[1]));
const add = (q) => reg.bank.push({ r: "animals", t: "mc", ...q, id: "animals-" + fnv("animals|" + q.a + q.q) });
add({ q: "When is the best time to find tidepool animals?", a: "At low tide, ideally a minus tide", w: ["At high tide, when the pools are full", "Right after a big storm rolls through", "Any time; the tide doesn't matter"] });
add({ q: "What are these black birds packed onto the cliffs at the Cove?", img: W("0/04/Cormorants_in_La_Jolla_%2870622%29.jpg/960px-Cormorants_in_La_Jolla_%2870622%29.jpg", "Rhododendrites, CC BY-SA 4.0"), a: "Brandt's cormorants", w: ["Brown pelicans", "Western gulls", "Great blue herons"] });
add({ q: "What is this big gull?", img: W("9/9b/Larus_occidentalis_-_pair_bonding_behaviour.jpg/960px-Larus_occidentalis_-_pair_bonding_behaviour.jpg", "Alan Vernon, CC BY 2.0"), a: "Western gull", w: ["Brandt's cormorant", "Brown pelican", "Snowy egret"] });
add({ q: "What is this animal by the walkway at the Cove?", img: W("b/b2/California_ground_squirrel_at_La_Jolla_standing_2.JPG/960px-California_ground_squirrel_at_La_Jolla_standing_2.JPG", "MSK, CC BY 4.0"), a: "California ground squirrel", w: ["Gray tree squirrel", "Desert cottontail", "Brown rat"] });
add({ q: "What is this big, soft animal in a tidepool?", img: W("b/b0/Aplysia_californica%2C_Channel_Is.jpg/960px-Aplysia_californica%2C_Channel_Is.jpg", "ED Bierman, CC BY 2.0"), a: "California sea hare", w: ["Two-spot octopus", "Sea cucumber", "Bat star"] });
add({ q: "What are these tiny white shells crusting the rock?", img: W("7/72/Chthamalus_stellatus.jpg/960px-Chthamalus_stellatus.jpg", "MichaelMaggs, CC BY-SA 3.0"), a: "Acorn barnacles", w: ["Gooseneck barnacles", "Owl limpets", "Black turban snails"] });
writeFileSync("site/regions/la-jolla.js", readFileSync("site/regions/la-jolla.js", "utf8").split("export const REGION")[0] + "export const REGION = " + JSON.stringify(reg, null, 1) + ";\n");
let md = readFileSync("docs/cuts.md", "utf8");
md = md.replace("# Safety facts corrected", "## Animals: easy La Jolla finds only\n- Ochre sea star: rare in La Jolla since sea star wasting disease.\n- Purple sea urchin, two-spot octopus, garibaldi: not easy to find on a walk.\n- Added: Brandt's cormorant, western gull, California ground squirrel, acorn barnacle (all easy on the Cove walk or at low tide).\n\n# Safety facts corrected");
writeFileSync("docs/cuts.md", md);
console.log(reg.bank.filter((q) => q.r === "animals").length, "animal questions");
