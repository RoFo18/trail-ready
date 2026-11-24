# Trail Ready: Second Class

Offline-first study app (PWA) for Scouts BSA Second Class. The campout is set at Joshua Tree; wildlife is La Jolla, tidepools first. Includes a Pledge drill ("I pledge allegiance," never "I pledge of").

- Every Second Class requirement appears on the sign-off screen with up to three parts: Know it (quiz mastery), Say it (talk-through checklist), Do it (hands-on, with a leader). A requirement is ready only when all its parts are done.
- Learn cards are predict-then-reveal: a situation, a guess, what actually happens and why, a picture to remember it, and a quick "now you try."
- My Logs tracks the multi-week parts: activity (4 weeks), earning plan and price comparison, service hours, outings.
- Question IDs are hashes of the question text, so editing the bank doesn't scramble saved progress. `site/migrate-map.js` carries over progress from the Nov 24 release.
- `site/` is the static app (no build step). Netlify publishes it from `main` automatically.
- Tests: `node tests/slots.test.js` (answer-position balance and guessing cues; Netlify runs it on every deploy) and `python3 tests/verdict.py` (answers every question correctly through the UI; needs a local server on :8765 serving `site/`).
