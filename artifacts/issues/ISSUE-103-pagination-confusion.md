# Issue #103: Confusion about sensor pagination limits

Status: Open

Opened by: `sdk-team`

Description:

We have client code still assuming a maximum `pageSize` of `50`, but the current docs say `100`. The API does not reject oversized values and instead caps them silently, which made the change harder to notice.

References:

- `docs/integration/sensor-api.md`
- `docs/integration/error-handling.md`
- `src/services/sensorService.js`
- Commit `4ce2873`

Comments:

- `sdk-team`: The docs are correct now, but older exported snippets from the bootstrap phase still mention `50`.
- `dev-rina`: The service caps with `Math.min(pageSize, 100)`, so asking for `200` comes back as `pagination.pageSize: 100`.
- `pm-ava`: Leaving this open until we decide whether silent capping is acceptable or whether we want a `400` for oversized requests.
