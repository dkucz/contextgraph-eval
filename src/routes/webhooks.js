const express = require("express");

const webhookService = require("../services/webhookService");

const router = express.Router();

router.get("/subscriptions", (req, res) => {
  res.json({ data: webhookService.subscriptions });
});

module.exports = router;
