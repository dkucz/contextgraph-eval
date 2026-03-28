const express = require("express");

const alertService = require("../services/alertService");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ data: alertService.DEFAULT_RULES });
});

module.exports = router;
