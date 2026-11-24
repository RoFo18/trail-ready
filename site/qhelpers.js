// Question constructors. IDs come from a hash of the requirement and question
// text, so adding or reordering questions never scrambles saved progress.
function hash(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h.toString(36);
}
export const qid = (req, q) => `${req}-${hash(req + "|" + q)}`;

export function mc(req, q, correct, wrong, why, local) {
  return { id: qid(req, q), req, type: "mc", q, correct, wrong, why, local };
}
export function tier(req, q, correct, wrong, bq, bcorrect, bwrong, why, local) {
  return { id: qid(req, q), req, type: "tier", q, correct, wrong, bq, bcorrect, bwrong, why, local };
}
export function order(req, q, steps, why) {
  return { id: qid(req, q), req, type: "order", q, steps, why };
}
export function match(req, q, pairs, why) {
  return { id: qid(req, q), req, type: "match", q, pairs, why };
}
export function odd(req, q, oddOne, others, bcorrect, bwrong, why) {
  return { id: qid(req, q), req, type: "odd", q, oddOne, others, bcorrect, bwrong, why };
}
// Tap word tiles into the right order. `extra` tiles are traps.
export function build(req, q, target, extra, why) {
  return { id: qid(req, q), req, type: "build", q, target, extra, why };
}
// Type the answer. `accept` are normalized right answers; `traps` map a
// normalized wrong answer to a specific explanation.
export function typed(req, q, accept, why, traps = {}, placeholder = "") {
  return { id: qid(req, q), req, type: "typed", q, accept, why, traps, placeholder };
}
// Say it from memory, then reveal and self-check.
export function recall(req, q, items, why) {
  return { id: qid(req, q), req, type: "recall", q, items, why };
}
export function photo(req, q, img, correct, wrong, why) {
  return { id: qid(req, q), req, type: "mc", q, img, correct, wrong, why };
}
