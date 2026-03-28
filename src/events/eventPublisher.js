function publishSensorEvent(event) {
  return {
    published: false,
    event,
  };
}

module.exports = {
  publishSensorEvent,
};
