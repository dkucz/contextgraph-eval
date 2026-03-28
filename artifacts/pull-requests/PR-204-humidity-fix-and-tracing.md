# PR #204: Fix humidity alerts and add end-to-end correlation IDs

Status: Merged into `main`

Linked commits:

- `a3e2bdb`
- `9421e3c`
- `af13c51`

Description:

Fixes the humidity alert regression introduced during measurement normalization and adds correlation ID propagation across API responses, webhook deliveries, and broker events.

Changed areas:

- `src/services/alertService.js`
- `src/services/sensorService.js`
- `src/server.js`
- `src/routes/sensors.js`
- `src/services/webhookService.js`
- `src/events/eventPublisher.js`
- `docs/integration/alert-rules.md`
- `docs/integration/webhooks.md`
- `docs/integration/events.md`
- `docs/integration/error-handling.md`

Review comments:

- `reviewer-sam`: I think the regression came from assuming every `gt` rule should read `temperatureC`. Humidity never gets that field.
- `author-noah`: Correct. The fix falls back to `sensor.reading` for non-temperature sensors.
- `reviewer-eli`: Correlation IDs are useful, but please keep the propagation rules consistent between webhooks and broker events.
- `author-noah`: Both paths now reuse `req.correlationId`, and the docs mention `X-Correlation-Id` explicitly.
