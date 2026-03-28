# Commit Timeline

All commits are merged into `main`.

## 1. `77aa9d8` `feat: bootstrap express backend skeleton`

Modified files:

- `README.md`
- `config/broker.js`
- `docs/integration/auth.md`
- `docs/integration/sensor-api.md`
- `docs/integration/alert-rules.md`
- `docs/integration/webhooks.md`
- `docs/integration/events.md`
- `docs/integration/events-migration.md`
- `docs/integration/error-handling.md`
- `src/server.js`
- `src/routes/sensors.js`
- `src/routes/alerts.js`
- `src/routes/webhooks.js`
- `src/services/sensorService.js`
- `src/services/alertService.js`
- `src/services/webhookService.js`
- `src/events/eventPublisher.js`

Highlights:

- Bootstrapped Express app with `/health` and sensor routes.
- Added initial docs with placeholders for auth, alerts, events, and webhooks.
- Seeded early pagination limit of `50`.

## 2. `3718ba1` `feat: add sensor ingestion validation`

Modified files:

- `README.md`
- `docs/integration/sensor-api.md`
- `src/routes/sensors.js`
- `src/services/sensorService.js`

Highlights:

- Added sensor type validation for `temperature`, `humidity`, and `motion`.
- Expanded ingest payload shape with `buildingId`, `deviceId`, and `unit`.
- Returned `400` for unsupported sensor types.

## 3. `9358517` `feat: add alert rule evaluation`

Modified files:

- `docs/integration/alert-rules.md`
- `src/routes/alerts.js`
- `src/routes/sensors.js`
- `src/server.js`
- `src/services/alertService.js`

Highlights:

- Added default alert rules for temperature, humidity, and motion.
- Exposed `GET /api/alerts`.
- Included alert evaluation in the sensor ingest response.

## 4. `25e0a5b` `feat: add webhook delivery for alerts`

Modified files:

- `docs/integration/webhooks.md`
- `src/routes/sensors.js`
- `src/routes/webhooks.js`
- `src/server.js`
- `src/services/webhookService.js`

Highlights:

- Added webhook subscription listing at `GET /api/webhooks/subscriptions`.
- Added alert delivery payload construction and signature header metadata.
- Documented sample webhook payload and sample target URL.

## 5. `6bef017` `fix: verify webhook signatures using raw body`

Modified files:

- `docs/integration/webhooks.md`
- `src/routes/webhooks.js`
- `src/server.js`
- `src/services/webhookService.js`

Highlights:

- Captured `req.rawBody` through the Express JSON verifier.
- Added `POST /api/webhooks/verify`.
- Clarified that HMAC validation must use the raw request body.

## 6. `d06ebcd` `feat: publish sensor events to broker`

Modified files:

- `config/broker.js`
- `docs/integration/events.md`
- `src/events/eventPublisher.js`
- `src/routes/sensors.js`

Highlights:

- Published ingests to exchange `sensor_events`.
- Added routing key `sensor.ingested`.
- Returned event publishing metadata in ingest responses.

## 7. `6b04633` `feat: require device JWT authentication`

Modified files:

- `README.md`
- `docs/integration/auth.md`
- `src/server.js`

Highlights:

- Enforced `Authorization: Bearer <token>` on `/api/*`.
- Added JWT verification and required claims documentation.
- Left `/health` unauthenticated.

## 8. `4ce2873` `feat: raise sensor pagination cap to 100`

Modified files:

- `docs/integration/error-handling.md`
- `docs/integration/sensor-api.md`
- `src/services/sensorService.js`

Highlights:

- Raised page size cap from `50` to `100`.
- Documented cap-and-echo pagination behavior.
- Added auth reminder to the sensor API guide.

## 9. `ec5e8f5` `migration: rename sensor_events to sensor_stream`

Modified files:

- `config/broker.js`
- `docs/integration/events-migration.md`

Highlights:

- Renamed broker exchange to `sensor_stream`.
- Published migration notes warning existing consumers bound to `sensor_events`.
- Left `docs/integration/events.md` outdated until the next commit.

## 10. `bb7828c` `docs: update event exchange migration guide`

Modified files:

- `docs/integration/events.md`

Highlights:

- Updated canonical docs from `sensor_events` to `sensor_stream`.
- Added note that `receivedAt` is the source event timestamp.

## 11. `a3e2bdb` `refactor: normalize sensor measurements before alert evaluation`

Modified files:

- `src/services/alertService.js`
- `src/services/sensorService.js`

Highlights:

- Added `temperatureC` and `motionDetected` normalization.
- Introduced a regression where `gt` alert rules read `sensor.temperatureC` for every sensor type.
- Humidity alerts stopped firing after this refactor.

## 12. `9421e3c` `fix: humidity alerts not triggering`

Modified files:

- `docs/integration/alert-rules.md`
- `src/services/alertService.js`

Highlights:

- Fixed `gt` comparisons to use `sensor.reading` for non-temperature sensors.
- Added implementation note documenting humidity rule behavior.

## 13. `af13c51` `feat: add correlation id propagation`

Modified files:

- `docs/integration/error-handling.md`
- `docs/integration/events.md`
- `docs/integration/webhooks.md`
- `src/events/eventPublisher.js`
- `src/routes/sensors.js`
- `src/server.js`
- `src/services/webhookService.js`

Highlights:

- Added `X-Correlation-Id` ingestion, response echoing, and propagation.
- Included correlation IDs in webhook payloads and broker event metadata.
- Documented tracing behavior across APIs and integrations.
