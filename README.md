# Trail Ready: Second Class

Offline-first study app (PWA) for Scouts BSA Second Class requirements, La Jolla edition: wildlife from the tidepools and coast, local hazards and rules.

- Covers every Second Class requirement that has something to know or explain (1b, 1c, 2a to 2g, 3a, 3c, 3d, 4, 5a, 5c, 5d, 6a to 6e, 7a to 7c, 8a to 8e, 9a, 9b, 10). Do-only items (1a, 3b, 5b, 11, 12) are not quizzed.
- `site/` is the static app (no build step). Netlify publishes it.
- `tests/slots.test.js` checks answer-position balance and the longest-answer tell. Netlify runs it on every deploy and fails the deploy if it fails.
