# PR #202: Fix webhook signature validation

Status: Merged into `main`

Linked commits:

- `6bef017`

Description:

Fixes signature verification by hashing the raw request body instead of a parsed JSON object.

Changed areas:

- `src/server.js`
- `src/routes/webhooks.js`
- `src/services/webhookService.js`
- `docs/integration/webhooks.md`

Review comments:

- `reviewer-eli`: `req.body` is already parsed by the time it reaches the route. If we compute HMAC there, the result is unstable.
- `author-rina`: Added `express.json({ verify })` so we can persist `req.rawBody`.
- `reviewer-sam`: Please call this out in the docs. External teams keep normalizing JSON before verification.
- `author-rina`: Added a warning that parsing and re-stringifying the JSON will fail validation.
