const express = require("express");

const sensorService = require("../services/sensorService");

const router = express.Router();

router.post("/ingest", (req, res) => {
  try {
    const sensor = sensorService.ingest(req.body);
    res.status(202).json({ accepted: true, sensor });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

router.get("/", (req, res) => {
  const page = Number.parseInt(req.query.page || "1", 10);
  const pageSize = Number.parseInt(req.query.pageSize || "25", 10);
  const results = sensorService.list({ page, pageSize });
  res.json(results);
});

module.exports = router;
