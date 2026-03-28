# PR #203: Migrate sensor event exchange to sensor_stream

Status: Merged into `main`

Linked commits:

- `ec5e8f5`
- `bb7828c`

Description:

Moves producers from `sensor_events` to `sensor_stream` and adds a migration note for downstream consumers.

Changed areas:

- `config/broker.js`
- `docs/integration/events-migration.md`
- `docs/integration/events.md`

Review comments:

- `reviewer-lena`: This will break consumers still bound to the old exchange. We need an explicit migration note before merging.
- `author-noah`: Added `docs/integration/events-migration.md` in `ec5e8f5`.
- `reviewer-lena`: Please also update the primary events guide. People won’t always read migration docs first.
- `author-noah`: Followed up in `bb7828c` to switch the canonical guide to `sensor_stream`.
