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
