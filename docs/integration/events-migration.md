# Events Migration

## 2026-02 Broker migration

The primary exchange has been renamed from `sensor_events` to `sensor_stream`.

Migration notes:

- Producers should publish to `sensor_stream`
- Routing keys are unchanged
- Consumers still bound to `sensor_events` will stop receiving new sensor messages
