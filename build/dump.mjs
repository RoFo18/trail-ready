import { BANK } from "../site/content.js";
import { REQS } from "../site/content.js";
const keys = process.argv.slice(2);
for (const k of keys) {
  const r = REQS[k]; console.log(`\n### ${k}: ${r.name}`);
  for (const c of [...(r.before||[]).map(c=>({...c,b:1})), ...r.learn]) console.log(`${c.b?"[before] ":""}== ${c.h}${c.img?" [img]":""}\n  ${c.p.join("\n  ")}`);
  for (const q of BANK.filter(q=>q.r===k)) {
    if (q.t==="mc") console.log(`Q ${q.id}${q.img?" [img]":""}: ${q.q} => ${q.a} | x ${q.w.join(" / ")}`);
    else if (q.t==="order") console.log(`O ${q.id}: ${q.q} :: ${q.steps.join(" > ")}`);
    else console.log(`M ${q.id}: ${q.q||""} :: ${q.pairs.map(p=>p.join(" = ")).join("; ")}`);
  }
}
