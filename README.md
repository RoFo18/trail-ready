# Trail Ready: Second Class

Offline-first study app (PWA) for Scouts BSA Second Class requirements, with First Class extras, set at Joshua Tree.

- `site/` is the static app (no build step). Netlify publishes it.
- `tests/slots.test.js` checks answer-position balance and the longest-answer tell. Netlify runs it on every deploy and fails the deploy if it fails.
