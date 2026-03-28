const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ data: [], message: "Webhook routes not implemented yet." });
});

module.exports = router;
