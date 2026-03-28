# Issue #102: Webhook deliveries failing with 400 during signature verification

Status: Closed

Opened by: `partner-support`

Description:

Integrations calling `POST /api/webhooks/verify` report `400 Invalid webhook signature` even when they use the shared signing secret.

Observations:

- Header used: `x-platform-signature`
- Secret used: `whsec_ops_demo`
- Failure only happens when the request body is parsed and re-serialized before verification

References:

- `src/routes/webhooks.js`
- `src/server.js`
- `docs/integration/webhooks.md`

Comments:

- `dev-rina`: The original implementation compared a signature computed over `JSON.stringify(req.body)`. That breaks because whitespace and key ordering can change.
- `reviewer-eli`: The fix should happen in Express middleware, not in the route. We need the raw bytes before JSON parsing.
- `maintainer-noah`: Resolved by `6bef017`. `express.json({ verify })` now stores `req.rawBody`, and the docs warn integrators not to re-stringify before validation.
