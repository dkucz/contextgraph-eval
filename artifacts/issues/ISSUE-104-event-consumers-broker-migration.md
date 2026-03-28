# Issue #104: Event consumers stopped receiving messages after broker migration

Status: Closed

Opened by: `integrations-sre`

Description:

After the February broker migration, downstream consumers bound to `sensor_events` stopped receiving sensor ingest notifications.

Symptoms:

- Producers are healthy
- API responses still show `published: true`
- Consumers recover after rebinding to the new exchange

References:

- `config/broker.js`
- `docs/integration/events-migration.md`
- `docs/integration/events.md`
- Commit `ec5e8f5`

Comments:

- `integrations-sre`: This was especially confusing for a few hours because `docs/integration/events.md` still said `sensor_events`.
- `maintainer-noah`: Right, `ec5e8f5` changed the code and migration guide first. The canonical events doc was corrected in `bb7828c`.
- `dev-rina`: If anyone is doing temporal analysis, the answer depends on whether they mean before or after `bb7828c`.
