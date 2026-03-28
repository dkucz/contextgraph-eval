# Sensor API

## Ingest sensor readings

`POST /api/sensors/ingest`

Example payload:

```json
{
  "id": "sensor-100",
  "type": "temperature",
  "reading": 21.4
}
```

## List sensors

`GET /api/sensors?page=1&pageSize=25`

- Default `pageSize` is `25`
- Maximum `pageSize` is `50`
