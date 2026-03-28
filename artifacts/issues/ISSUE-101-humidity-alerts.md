# Issue #101: Alerts not firing for humidity sensors

Status: Closed

Opened by: `qa-mila`

Description:

Humidity sensors above the documented threshold are accepted by `POST /api/sensors/ingest`, but no alert is returned in the response. This started after the measurement normalization refactor.

Reproduction:

1. Send a humidity ingest with `reading: 76`
2. Use a valid device JWT
3. Observe that `alerts` is empty even though `docs/integration/alert-rules.md` says humidity above `70` is `critical`

References:

- `src/services/alertService.js`
- `src/services/sensorService.js`
- Commit `a3e2bdb`

Comments:

- `ops-jared`: I bisected this to `a3e2bdb`. The refactor added `temperatureC`, but humidity still only has `reading`.
- `dev-rina`: Confirmed. `matches()` is reading `sensor.temperatureC` for every `gt` rule, so humidity becomes `Number(undefined)`.
- `maintainer-noah`: Fixed in `9421e3c`. I also updated `docs/integration/alert-rules.md` so the implementation detail is explicit.
