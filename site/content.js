// Merges the core content with one region. Add a region by adding a file in ./regions and listing it here.
import { SECTIONS, REQS as CORE_REQS } from "./learn.js";
import { BANK as CORE_BANK } from "./bank.js";
import { REGION } from "./regions/la-jolla.js";

export { SECTIONS };
export const REGION_NAME = REGION.name;
export const REQS = Object.fromEntries(Object.entries(CORE_REQS).map(([k, r]) =>
  [k, { ...r, learn: [...r.learn, ...(REGION.learn[k] || [])] }]));
// Region questions sit after the core questions for the same requirement.
export const BANK = Object.keys(CORE_REQS).flatMap((k) => [
  ...CORE_BANK.filter((q) => q.r === k), ...REGION.bank.filter((q) => q.r === k)]);
