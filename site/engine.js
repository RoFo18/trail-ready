// Small helpers with no DOM code, so they can be tested in Node.

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

// Keeps the correct answer spread evenly across positions and never in the
// same position three times in a row.
export class SlotPicker {
  constructor(rng) { this.rng = rng; this.history = []; this.newTest(); }
  newTest() { this.usage = [0, 0, 0, 0, 0, 0]; }
  next(n) {
    const h = this.history;
    const banned = h.length >= 2 && h[h.length - 1] === h[h.length - 2] ? h[h.length - 1] : -1;
    let c = [];
    for (let s = 0; s < n; s++) if (s !== banned) c.push(s);
    const min = Math.min(...c.map((s) => this.usage[s]));
    c = c.filter((s) => this.usage[s] === min);
    const slot = c[Math.floor(this.rng() * c.length)];
    this.usage[slot]++;
    h.push(slot);
    if (h.length > 4) h.shift();
    return slot;
  }
}

export function layoutOptions(correct, wrongs, slot, rng) {
  const out = shuffle(wrongs, rng);
  out.splice(slot, 0, correct);
  return out;
}

// Build a test: questions not yet answered right, in shuffled order.
export function buildTest(bank, key, right, rng) {
  const qs = bank.filter((q) => q.r === key && !right[q.id]);
  return shuffle(qs, rng);
}
