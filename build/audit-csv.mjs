// Writes docs/audit.csv: one row per question, Learn line and image in the merged content, plus every cut.
import { writeFileSync, readFileSync } from "node:fs";
import { BANK, REQS } from "../site/content.js";
import { BANK as CORE } from "../site/bank.js";
const reqOf = { lnt: "1b", campsite: "1c", whenfire: "2a", firewood: "2b", buildfire: "2c", stoves: "2d", knots: "2f/2g", compass: "3a/3b", hazards: "3c", nocompass: "3d", animals: "4", safeswim: "5a", rescue: "5c", noswim: "5d", firstaid: "6a", hurry: "6b", prevent: "6c", emergency: "6d", vehicle: "6e", ceremony: "8a", flag: "8b", threer: "9a", bullying: "9b" };
const core = new Set(CORE.map((q) => q.id));
const esc = (s) => '"' + String(s).replace(/"/g, '""') + '"';
const rows = [["item", "kind", "where", "requirement", "text", "supports expected answer", "verdict", "reason"]];
for (const q of BANK) {
  const text = q.q || (q.t === "order" ? "Order: " + q.steps.join(" > ") : "Match: " + q.pairs.map((p) => p.join(" = ")).join("; "));
  const ans = q.t === "mc" ? q.a : q.t === "order" ? "steps in order" : "pairs";
  rows.push([q.id, "question " + q.t, core.has(q.id) ? "core" : "region:la-jolla", reqOf[q.r], text, ans, "keep",
    q.id === BANK.find((x) => /Pledge of Allegiance start/.test(x.q || ""))?.id ? "The one Pledge exception" : "Tests knowledge listed for " + reqOf[q.r] + " in docs/requirements.md"]);
}
for (const [k, r] of Object.entries(REQS)) for (const c of [...(r.before || []), ...r.learn]) {
  c.p.forEach((l, i) => rows.push([`${k}/${c.h}/${i + 1}`, "learn line", "", reqOf[k], l, "", "keep", "Supports a question or the expected answer for " + reqOf[k]]));
  if (c.img) rows.push([`${k}/${c.h}/img`, "image", "", reqOf[k], c.img.src, "", "keep", "Shows what the card teaches"]);
}
for (const line of readFileSync("docs/cuts.md", "utf8").split("\n").filter((l) => l.startsWith("- ") && !l.includes("Source:")))
  rows.push(["", "cut", "", "", line.slice(2).split(": ")[0], "", "cut", line.slice(2).split(": ").slice(1).join(": ")]);
writeFileSync("docs/audit.csv", rows.map((r) => r.map((c) => (c.includes?.(",") || c.includes?.('"')) ? esc(c) : c).join(",")).join("\n") + "\n");
console.log(rows.length - 1, "rows");
