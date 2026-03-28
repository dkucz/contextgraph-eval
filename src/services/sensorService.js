const sensors = [];

function ingest(payload) {
  const sensor = {
    id: payload.id,
    type: payload.type,
    reading: payload.reading,
    receivedAt: payload.receivedAt || new Date().toISOString(),
  };

  sensors.push(sensor);
  return sensor;
}

function list({ page, pageSize }) {
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const safePageSize = Number.isNaN(pageSize) || pageSize < 1 ? 25 : Math.min(pageSize, 50);
  const start = (safePage - 1) * safePageSize;
  const data = sensors.slice(start, start + safePageSize);

  return {
    data,
    pagination: {
      page: safePage,
      pageSize: safePageSize,
      total: sensors.length,
    },
  };
}

module.exports = {
  ingest,
  list,
};
