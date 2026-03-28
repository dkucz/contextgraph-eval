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

function buildPayload(alert, sensor) {
  return {
    alertId: alert.alertId,
    ruleId: alert.ruleId,
    severity: alert.severity,
    sensor: {
      id: sensor.id,
      type: sensor.type,
      reading: sensor.reading,
      buildingId: sensor.buildingId,
    },
    triggeredAt: alert.triggeredAt,
  };
}

function deliver(alert, sensor) {
  const payload = buildPayload(alert, sensor);

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
