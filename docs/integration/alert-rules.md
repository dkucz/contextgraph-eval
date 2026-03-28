# Alert Rules

`GET /api/alerts`

Default rules:

- `temperature` readings above `30` trigger `warning`
- `humidity` readings above `70` trigger `critical`
- `motion` readings equal to `true` trigger `warning`

Supported severity levels:

- `warning`
- `critical`
