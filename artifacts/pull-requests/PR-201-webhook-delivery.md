# PR #201: Add webhook delivery for alerts

Status: Merged into `main`

Linked commits:

- `25e0a5b`

Description:

Adds webhook subscription metadata and sends alert payloads to registered targets when alert rules trigger during sensor ingestion.

Changed areas:

- `src/services/webhookService.js`
- `src/routes/webhooks.js`
- `src/routes/sensors.js`
- `docs/integration/webhooks.md`

Review comments:

- `reviewer-eli`: Please document the exact header name. Consumers will need to know whether we use `x-platform-signature` or a vendor-specific prefix.
- `author-rina`: Added the header name and a sample target URL in `docs/integration/webhooks.md`.
- `reviewer-sam`: The payload shape looks fine, but I expect a follow-up for verification. Right now we only send signatures; we do not validate incoming callbacks anywhere.
