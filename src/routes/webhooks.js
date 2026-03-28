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
