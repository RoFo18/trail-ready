// Trail Ready engine: random numbers, balanced answer slots, spaced repetition,
// round building. No DOM code here so it can be unit tested in Node.

// Seeded PRNG (mulberry32).
export function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- Balanced answer slots ----------
// AI-written quizzes overuse slot B. This picker keeps every slot roughly equal
// within a round and never puts the correct answer in the same slot three
// times in a row (history carries across rounds).
export class SlotPicker {
  constructor(rng) {
    this.rng = rng;
    this.history = []; // last slots used, newest last
    this.newRound();
  }
  newRound() {
    this.usage = [0, 0, 0, 0, 0, 0];
  }
  next(nOptions) {
    const h = this.history;
    const banned =
      h.length >= 2 && h[h.length - 1] === h[h.length - 2] ? h[h.length - 1] : -1;
    let candidates = [];
    for (let s = 0; s < nOptions; s++) if (s !== banned) candidates.push(s);
    const min = Math.min(...candidates.map((s) => this.usage[s]));
    candidates = candidates.filter((s) => this.usage[s] === min);
    const slot = candidates[Math.floor(this.rng() * candidates.length)];
    this.usage[slot]++;
    h.push(slot);
    if (h.length > 4) h.shift();
    return slot;
  }
}

// Place the correct answer at `slot`, wrong answers shuffled around it.
export function layoutOptions(correct, wrongs, slot, rng) {
  const others = shuffle(wrongs, rng);
  const out = others.slice();
  out.splice(slot, 0, correct);
  return out;
}

// ---------- Spaced repetition (Leitner boxes) ----------
// box 0..4. An item is "mastered" at box >= 3. Promotion happens at most once
// per round, so mastery needs correct answers in at least 3 separate rounds.
export const MASTER_BOX = 3;

export function freshState() {
  return {
    items: {}, // id -> { box, seen, right, wrong, lastRound, promotedRound, hyper }
    reqFormats: {}, // reqId -> { type: true } formats answered correctly
    teach: {}, // reqId -> true when teach-back self-check fully passed
    round: 0,
    xp: 0,
    streak: { last: null, count: 0 },
    topicsStarted: {},
    settings: { sound: false, reduceMotion: false },
    storyDone: false,
    doit: {}, // reqId -> [bool] hands-on checklist
    pledge: { days: [] }, // distinct days the opening was right and sure
    logs: { activity: [], service: [], outings: [], earn: { item: "", cost: "", perWeek: "", how: "", entries: [], prices: [], decision: "" } },
  };
}

export function itemState(state, id) {
  if (!state.items[id]) state.items[id] = { box: 0, seen: 0, right: 0, wrong: 0, lastRound: -1, promotedRound: -1, hyper: false };
  return state.items[id];
}

// result: { correct: bool, sure: bool }
export function recordAnswer(state, q, result) {
  const it = itemState(state, q.id);
  it.seen++;
  it.lastRound = state.round;
  if (result.correct) {
    it.right++;
    if (!state.reqFormats[q.req]) state.reqFormats[q.req] = {};
    if (result.sure) {
      state.reqFormats[q.req][q.type] = true;
      if (it.promotedRound !== state.round) {
        it.box = Math.min(4, it.box + 1);
        it.promotedRound = state.round;
      }
      it.hyper = false;
    }
    // A correct guess earns no promotion: it still counts as unlearned.
    state.xp += result.sure ? 10 : 6;
  } else {
    it.wrong++;
    // Hypercorrection: confident errors are flagged for priority review.
    it.hyper = !!result.sure;
    it.box = 0;
    state.xp += 2;
  }
}

export function reqStatus(state, reqId, questions) {
  const qs = questions.filter((q) => q.req === reqId);
  if (!qs.length) return { status: state.teach[reqId] ? "green" : "gray", pct: state.teach[reqId] ? 100 : 0 };
  let seen = 0, mastered = 0, boxSum = 0;
  for (const q of qs) {
    const it = state.items[q.id];
    if (it && it.seen) seen++;
    if (it && it.box >= MASTER_BOX) mastered++;
    boxSum += it ? Math.min(it.box, MASTER_BOX) : 0;
  }
  const formats = Object.keys(state.reqFormats[reqId] || {}).length;
  const pct = Math.round((100 * boxSum) / (qs.length * MASTER_BOX));
  const allMastered = mastered === qs.length;
  const formatsOk = formats >= Math.min(2, new Set(qs.map((q) => q.type)).size);
  if (allMastered && formatsOk) return { status: "green", pct: 100 };
  if (seen === 0) return { status: "gray", pct: 0 };
  return { status: "partial", pct: Math.max(5, Math.min(pct, 95)) };
}

// Priority: confident errors first, then lowest box, then least recently seen.
function priority(state, q) {
  const it = state.items[q.id];
  if (!it) return 50; // new
  if (it.hyper) return 0;
  const sinceSeen = Math.min(10, state.round - it.lastRound);
  return 20 + it.box * 20 - sinceSeen;
}

// Interleave: avoid the same requirement twice in a row, mix formats.
export function buildRound(state, questions, rng, opts = {}) {
  const size = opts.size || 6;
  let pool = questions;
  if (opts.topic) pool = pool.filter((q) => opts.reqTopic[q.req] === opts.topic);
  if (opts.types) pool = pool.filter((q) => opts.types.includes(q.type));
  if (opts.excludeMastered) {
    const notM = pool.filter((q) => !(state.items[q.id] && state.items[q.id].box >= MASTER_BOX));
    if (notM.length >= size) pool = notM;
  }
  const scored = shuffle(pool, rng).map((q) => ({ q, p: priority(state, q) + rng() * 8 }));
  scored.sort((a, b) => a.p - b.p);
  const pick = scored.slice(0, Math.min(size * 3, scored.length)).map((s) => s.q);
  // Greedy interleave.
  const out = [];
  const rest = pick.slice();
  while (out.length < size && rest.length) {
    const last = out[out.length - 1];
    let idx = rest.findIndex((q) => !last || (q.req !== last.req && q.type !== last.type));
    if (idx < 0) idx = rest.findIndex((q) => !last || q.req !== last.req);
    if (idx < 0) idx = 0;
    out.push(rest.splice(idx, 1)[0]);
  }
  return out;
}

export function touchStreak(state, today) {
  const s = state.streak;
  if (s.last === today) return;
  const y = new Date(today);
  y.setDate(y.getDate() - 1);
  const yesterday = y.toISOString().slice(0, 10);
  s.count = s.last === yesterday ? s.count + 1 : 1;
  s.last = today;
}
