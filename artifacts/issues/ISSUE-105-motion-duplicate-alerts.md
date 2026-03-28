# Issue #105: Motion sensors generating duplicate alerts

Status: Open

Opened by: `building-ops`

Description:

We occasionally see repeated `rule-motion-after-hours` alerts for the same motion detector when devices resend the same `reading: true` sample.

References:

- `src/routes/sensors.js`
- `src/services/alertService.js`
- `src/services/webhookService.js`

Comments:

- `building-ops`: Looks like ingest is stateless, so duplicate sensor samples naturally retrigger alert evaluation.
- `dev-rina`: Agreed. Nothing in `sensorService` deduplicates by device sample or timestamp.
- `pm-ava`: Keeping this as backlog. It is useful for evaluation because the issue explains the constraint even though no fix exists yet.
