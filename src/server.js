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
