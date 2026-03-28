# Events

Sensor ingests are published to the broker exchange `sensor_stream`.

Current event contract:

- Exchange: `sensor_stream`
- Routing key: `sensor.ingested`
- Payload fields: `type`, `sensorId`, `sensorType`, `buildingId`, `receivedAt`
- Optional propagation field: `correlationId`
- Consumers should treat `receivedAt` as the source event timestamp
