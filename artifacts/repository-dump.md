# Synthetic Repository Dump

This file mirrors the requested output format for evaluation work.

## 1. Repository File Tree

```text
building-sensor-platform/
├── README.md
├── artifacts/
│   ├── commit-timeline.md
│   ├── issues/
│   │   ├── ISSUE-101-humidity-alerts.md
│   │   ├── ISSUE-102-webhook-signature-400.md
│   │   ├── ISSUE-103-pagination-confusion.md
│   │   ├── ISSUE-104-event-consumers-broker-migration.md
│   │   ├── ISSUE-105-motion-duplicate-alerts.md
│   │   └── ISSUE-106-auth-claims-docs.md
│   └── pull-requests/
│       ├── PR-201-webhook-delivery.md
│       ├── PR-202-webhook-signature-fix.md
│       ├── PR-203-broker-migration.md
│       └── PR-204-humidity-fix-and-tracing.md
├── config/
│   └── broker.js
├── docs/
│   └── integration/
│       ├── alert-rules.md
│       ├── auth.md
│       ├── error-handling.md
│       ├── events-migration.md
│       ├── events.md
│       ├── sensor-api.md
│       └── webhooks.md
└── src/
    ├── events/
    │   └── eventPublisher.js
    ├── routes/
    │   ├── alerts.js
    │   ├── sensors.js
    │   └── webhooks.js
    ├── server.js
    └── services/
        ├── alertService.js
        ├── sensorService.js
        └── webhookService.js
```

## 2. Commit Timeline

See `artifacts/commit-timeline.md`.

Commit order:

1. `77aa9d8` `feat: bootstrap express backend skeleton`
2. `3718ba1` `feat: add sensor ingestion validation`
3. `9358517` `feat: add alert rule evaluation`
4. `25e0a5b` `feat: add webhook delivery for alerts`
5. `6bef017` `fix: verify webhook signatures using raw body`
6. `d06ebcd` `feat: publish sensor events to broker`
7. `6b04633` `feat: require device JWT authentication`
8. `4ce2873` `feat: raise sensor pagination cap to 100`
9. `ec5e8f5` `migration: rename sensor_events to sensor_stream`
10. `bb7828c` `docs: update event exchange migration guide`
11. `a3e2bdb` `refactor: normalize sensor measurements before alert evaluation`
12. `9421e3c` `fix: humidity alerts not triggering`
13. `af13c51` `feat: add correlation id propagation`

## 3. Contents of All Source and Documentation Files

### `README.md`

```md
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

- API routes require `Authorization: Bearer <token>`.
- Sensor list responses are paginated.
- Supported sensor types include `temperature`, `humidity`, and `motion`.
```

### `src/server.js`

```js
const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const alertRoutes = require("./routes/alerts");
const sensorRoutes = require("./routes/sensors");
const webhookRoutes = require("./routes/webhooks");

const app = express();
const JWT_SECRET = "dev-platform-secret";

app.use(
  express.json({
    verify: (req, res, buffer) => {
      req.rawBody = buffer.toString("utf8");
    },
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "building-sensor-platform" });
});

app.use((req, res, next) => {
  const correlationId = req.header("x-correlation-id") || crypto.randomUUID();
  req.correlationId = correlationId;
  res.setHeader("x-correlation-id", correlationId);
  next();
});

app.use("/api", (req, res, next) => {
  const authorization = req.header("authorization") || "";

  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Bearer token." });
  }

  const token = authorization.slice("Bearer ".length);

  try {
    req.device = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid device token." });
  }
});

app.use("/api/alerts", alertRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/webhooks", webhookRoutes);

module.exports = app;
```

### `src/routes/sensors.js`

```js
const express = require("express");

const alertService = require("../services/alertService");
const eventPublisher = require("../events/eventPublisher");
const sensorService = require("../services/sensorService");
const webhookService = require("../services/webhookService");

const router = express.Router();

router.post("/ingest", (req, res) => {
  try {
    const sensor = sensorService.ingest(req.body);
    const alerts = alertService.evaluateAlerts(sensor);
    const deliveries = alerts.flatMap((alert) =>
      webhookService.deliver(alert, sensor, req.correlationId)
    );
    const event = eventPublisher.publishSensorEvent({
      type: "sensor.ingested",
      sensorId: sensor.id,
      sensorType: sensor.type,
      buildingId: sensor.buildingId,
      receivedAt: sensor.receivedAt,
      correlationId: req.correlationId,
    });

    res.status(202).json({ accepted: true, correlationId: req.correlationId, sensor, alerts, deliveries, event });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message, correlationId: req.correlationId });
  }
});

router.get("/", (req, res) => {
  const page = Number.parseInt(req.query.page || "1", 10);
  const pageSize = Number.parseInt(req.query.pageSize || "25", 10);
  const results = sensorService.list({ page, pageSize });
  res.json(results);
});

module.exports = router;
```

### `src/routes/alerts.js`

```js
const express = require("express");

const alertService = require("../services/alertService");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ data: alertService.DEFAULT_RULES });
});

module.exports = router;
```

### `src/routes/webhooks.js`

```js
const express = require("express");

const webhookService = require("../services/webhookService");

const router = express.Router();

router.get("/subscriptions", (req, res) => {
  res.json({ data: webhookService.subscriptions });
});

router.post("/verify", (req, res) => {
  const signature = req.header("x-platform-signature");
  const secret = req.header("x-webhook-secret") || "whsec_ops_demo";
  const verified = webhookService.verifyIncomingSignature(req.rawBody, signature, secret);

  if (!verified) {
    return res.status(400).json({ error: "Invalid webhook signature." });
  }

  return res.json({ verified: true });
});

module.exports = router;
```

### `src/services/sensorService.js`

```js
const sensors = [];
const VALID_SENSOR_TYPES = ["temperature", "humidity", "motion"];

function ingest(payload) {
  if (!VALID_SENSOR_TYPES.includes(payload.type)) {
    const error = new Error(`Unsupported sensor type: ${payload.type}`);
    error.statusCode = 400;
    throw error;
  }

  const sensor = {
    id: payload.id,
    buildingId: payload.buildingId,
    deviceId: payload.deviceId,
    type: payload.type,
    reading: payload.reading,
    unit: payload.unit || null,
    receivedAt: payload.receivedAt || new Date().toISOString(),
  };

  if (payload.type === "temperature") {
    sensor.temperatureC = payload.reading;
  }

  if (payload.type === "motion") {
    sensor.motionDetected = payload.reading === true;
  }

  sensors.push(sensor);
  return sensor;
}

function list({ page, pageSize }) {
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const safePageSize = Number.isNaN(pageSize) || pageSize < 1 ? 25 : Math.min(pageSize, 100);
  const start = (safePage - 1) * safePageSize;
  const data = sensors.slice(start, start + safePageSize);

  return {
    data,
    pagination: {
      page: safePage,
      pageSize: safePageSize,
      total: sensors.length,
    },
    supportedSensorTypes: VALID_SENSOR_TYPES,
  };
}

module.exports = {
  ingest,
  list,
  VALID_SENSOR_TYPES,
};
```

### `src/services/alertService.js`

```js
const DEFAULT_RULES = [
  {
    id: "rule-temp-high",
    sensorType: "temperature",
    operator: "gt",
    threshold: 30,
    severity: "warning",
  },
  {
    id: "rule-humidity-high",
    sensorType: "humidity",
    operator: "gt",
    threshold: 70,
    severity: "critical",
  },
  {
    id: "rule-motion-after-hours",
    sensorType: "motion",
    operator: "eq",
    threshold: true,
    severity: "warning",
  },
];

function matches(rule, sensor) {
  if (rule.sensorType !== sensor.type) {
    return false;
  }

  if (rule.operator === "gt") {
    const numericReading =
      sensor.type === "temperature" ? Number(sensor.temperatureC) : Number(sensor.reading);

    return numericReading > rule.threshold;
  }

  if (rule.operator === "eq") {
    return sensor.reading === rule.threshold;
  }

  return false;
}

function evaluateAlerts(sensor, rules = DEFAULT_RULES) {
  return rules
    .filter((rule) => matches(rule, sensor))
    .map((rule) => ({
      alertId: `${rule.id}:${sensor.id}`,
      ruleId: rule.id,
      sensorId: sensor.id,
      sensorType: sensor.type,
      severity: rule.severity,
      triggeredAt: sensor.receivedAt,
    }));
}

module.exports = {
  DEFAULT_RULES,
  evaluateAlerts,
};
```

### `src/services/webhookService.js`

```js
const crypto = require("crypto");

const subscriptions = [
  {
    id: "wh-building-ops",
    eventType: "alert.triggered",
    targetUrl: "https://ops.example.com/hooks/building-alerts",
    signingSecret: "whsec_ops_demo",
    active: true,
  },
];

function buildPayload(alert, sensor, correlationId) {
  return {
    alertId: alert.alertId,
    ruleId: alert.ruleId,
    severity: alert.severity,
    correlationId,
    sensor: {
      id: sensor.id,
      type: sensor.type,
      reading: sensor.reading,
      buildingId: sensor.buildingId,
    },
    triggeredAt: alert.triggeredAt,
  };
}

function deliver(alert, sensor, correlationId) {
  const payload = buildPayload(alert, sensor, correlationId);

  return subscriptions
    .filter((subscription) => subscription.active && subscription.eventType === "alert.triggered")
    .map((subscription) => ({
      deliveryId: `${subscription.id}:${alert.alertId}`,
      targetUrl: subscription.targetUrl,
      signatureHeader: "x-platform-signature",
      signatureValue: signPayload(JSON.stringify(payload), subscription.signingSecret),
      delivered: true,
      payload,
    }));
}

function signPayload(rawBody, signingSecret) {
  return crypto.createHmac("sha256", signingSecret).update(rawBody).digest("hex");
}

function verifyIncomingSignature(rawBody, signature, signingSecret) {
  if (!rawBody) {
    return false;
  }

  const expected = signPayload(rawBody, signingSecret);
  return expected === signature;
}

module.exports = {
  buildPayload,
  signPayload,
  subscriptions,
  deliver,
  verifyIncomingSignature,
};
```

### `src/events/eventPublisher.js`

```js
const brokerConfig = require("../../config/broker");

function publishSensorEvent(event) {
  return {
    published: true,
    exchange: brokerConfig.exchangeName,
    routingKey: brokerConfig.routingKeys.sensorIngested,
    correlationId: event.correlationId,
    event,
  };
}

module.exports = {
  publishSensorEvent,
};
```

### `config/broker.js`

```js
module.exports = {
  exchangeName: "sensor_stream",
  routingKeys: {
    sensorIngested: "sensor.ingested",
    alertTriggered: "alert.triggered",
  },
};
```

### `docs/integration/auth.md`

~~~~md
# Authentication

All `/api/*` endpoints require a device JWT in the `Authorization` header.

Header format:

`Authorization: Bearer <token>`

Expected JWT claims:

- `sub`: device identifier
- `buildingId`: building scope for the device
- `scope`: must include `sensor:write` for ingest endpoints

Notes:

- Tokens are signed with `HS256`
- Missing or invalid tokens return `401`
~~~~

### `docs/integration/sensor-api.md`

~~~~md
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
~~~~

### `docs/integration/alert-rules.md`

~~~~md
# Alert Rules

`GET /api/alerts`

Default rules:

- `temperature` readings above `30` trigger `warning`
- `humidity` readings above `70` trigger `critical`
- `motion` readings equal to `true` trigger `warning`

Supported severity levels:

- `warning`
- `critical`

Implementation note:

- Humidity rules compare against the sensor `reading` value
~~~~

### `docs/integration/webhooks.md`

~~~~md
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
~~~~

### `docs/integration/events.md`

~~~~md
# Events

Sensor ingests are published to the broker exchange `sensor_stream`.

Current event contract:

- Exchange: `sensor_stream`
- Routing key: `sensor.ingested`
- Payload fields: `type`, `sensorId`, `sensorType`, `buildingId`, `receivedAt`
- Optional propagation field: `correlationId`
- Consumers should treat `receivedAt` as the source event timestamp
~~~~

### `docs/integration/events-migration.md`

~~~~md
# Events Migration

## 2026-02 Broker migration

The primary exchange has been renamed from `sensor_events` to `sensor_stream`.

Migration notes:

- Producers should publish to `sensor_stream`
- Routing keys are unchanged
- Consumers still bound to `sensor_events` will stop receiving new sensor messages
~~~~

### `docs/integration/error-handling.md`

~~~~md
# Error Handling

Common API responses:

- `400` for unsupported sensor types or invalid webhook signatures
- `401` for missing or invalid device JWTs
- `202` for accepted sensor ingests

Tracing:

- Responses may include `x-correlation-id`
- Clients can provide `X-Correlation-Id` to reuse their own trace identifier

Pagination behavior:

- Requests above the sensor `pageSize` limit are capped instead of rejected
- The capped value is reflected in the `pagination.pageSize` field
~~~~

## 4. GitHub Issues

See files under `artifacts/issues/`.

- `#101` Alerts not firing for humidity sensors
- `#102` Webhook deliveries failing with 400 during signature verification
- `#103` Confusion about sensor pagination limits
- `#104` Event consumers stopped receiving messages after broker migration
- `#105` Motion sensors generating duplicate alerts
- `#106` Auth guide does not make required JWT claims obvious enough

## 5. Pull Requests

See files under `artifacts/pull-requests/`.

- `#201` Add webhook delivery for alerts
- `#202` Fix webhook signature validation
- `#203` Migrate sensor event exchange to sensor_stream
- `#204` Fix humidity alerts and add end-to-end correlation IDs

## 6. Issue Comments

Issue comments are embedded in each issue file under `artifacts/issues/`.

## 7. PR Review Comments

PR review comments are embedded in each pull request file under `artifacts/pull-requests/`.
