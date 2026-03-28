# Smart Building Sensor Platform

Node.js and Express backend for managing building sensors, alert rules, webhook notifications, and event streaming.

## Components

- REST API for sensor ingestion and administration
- Alert rule evaluation
- Webhook delivery pipeline
- Broker-backed event streaming
- Device authentication with JWT

## Current API snapshot

- `POST /api/sensors/ingest`
- `GET /api/sensors`
- `GET /health`

## Notes

- Sensor list responses are paginated.
- Supported sensor types include `temperature` and `motion`.
