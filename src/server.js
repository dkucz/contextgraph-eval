const express = require("express");

const alertRoutes = require("./routes/alerts");
const sensorRoutes = require("./routes/sensors");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "building-sensor-platform" });
});

app.use("/api/alerts", alertRoutes);
app.use("/api/sensors", sensorRoutes);

module.exports = app;
