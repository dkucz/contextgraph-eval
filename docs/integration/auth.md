# Authentication

All `/api/*` endpoints require a device JWT in the `Authorization` header.

Header format:

`Authorization: Bearer <token>`

Expected JWT claims:

- `sub`: device identifier
- `buildingId`: building scope for the device
- `scope`: must include `sensor:write` for ingest endpoints

Notes:

- Tokens are signed with `HS256`
- Missing or invalid tokens return `401`
