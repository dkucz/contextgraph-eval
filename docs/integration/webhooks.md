# Webhooks

Webhook subscriptions are available at `GET /api/webhooks/subscriptions`.

Current delivery behavior:

- Event type: `alert.triggered`
- Signature header: `x-platform-signature`
- Verification endpoint: `POST /api/webhooks/verify`
- Example target URL: `https://ops.example.com/hooks/building-alerts`

Signatures are generated with `HMAC-SHA256` using the raw request body. Integrations that parse and re-stringify the JSON before validation will fail verification.

Example payload:

```json
{
  "alertId": "rule-temp-high:sensor-100",
  "ruleId": "rule-temp-high",
  "severity": "warning",
  "correlationId": "1a2d2b5f-664b-455e-9064-c6e95e89c7ae",
  "sensor": {
    "id": "sensor-100",
    "type": "temperature",
    "reading": 31.2,
    "buildingId": "building-east"
  },
  "triggeredAt": "2026-01-12T10:15:00.000Z"
}
```

If the sender includes `X-Correlation-Id`, the same value is echoed in webhook deliveries and event payloads.
