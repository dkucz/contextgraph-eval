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
