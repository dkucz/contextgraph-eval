# Webhooks

Webhook subscriptions are available at `GET /api/webhooks/subscriptions`.

Current delivery behavior:

- Event type: `alert.triggered`
- Signature header: `x-platform-signature`
- Example target URL: `https://ops.example.com/hooks/building-alerts`

Example payload:

```json
{
  "alertId": "rule-temp-high:sensor-100",
  "ruleId": "rule-temp-high",
  "severity": "warning",
  "sensor": {
    "id": "sensor-100",
    "type": "temperature",
    "reading": 31.2,
    "buildingId": "building-east"
  },
  "triggeredAt": "2026-01-12T10:15:00.000Z"
}
```
