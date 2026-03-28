# Sensor API

## Ingest sensor readings

`POST /api/sensors/ingest`

Example payload:

```json
{
  "id": "sensor-100",
  "buildingId": "building-east",
  "deviceId": "dev-201",
  "type": "temperature",
  "reading": 21.4,
  "unit": "C"
}
```

Valid sensor types:

- `temperature`
- `humidity`
- `motion`

## List sensors

`GET /api/sensors?page=1&pageSize=25`

- Default `pageSize` is `25`
- Maximum `pageSize` is `100`
- Requests above the maximum are capped by the service

Authentication:

- Header format: `Authorization: Bearer <token>`
