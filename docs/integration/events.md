# Events

Sensor ingests are published to the broker exchange `sensor_events`.

Current event contract:

- Exchange: `sensor_events`
- Routing key: `sensor.ingested`
- Payload fields: `type`, `sensorId`, `sensorType`, `buildingId`, `receivedAt`
