# Issue #106: Auth guide does not make required JWT claims obvious enough

Status: Open

Opened by: `partner-onboarding`

Description:

Several integrators understood the `Authorization: Bearer <token>` format, but still missed the required claims for device-scoped access.

References:

- `docs/integration/auth.md`
- `src/server.js`

Comments:

- `partner-onboarding`: We want a clearer example token payload with `sub`, `buildingId`, and `scope`.
- `dev-rina`: The middleware only verifies the token signature today. The docs are stricter than the code about `scope`, which is another subtle source of confusion.
- `maintainer-noah`: Leaving this open. It is both a documentation gap and a code-vs-doc inconsistency.
