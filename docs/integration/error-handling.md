# Error Handling

Common API responses:

- `400` for unsupported sensor types or invalid webhook signatures
- `401` for missing or invalid device JWTs
- `202` for accepted sensor ingests

Pagination behavior:

- Requests above the sensor `pageSize` limit are capped instead of rejected
- The capped value is reflected in the `pagination.pageSize` field
