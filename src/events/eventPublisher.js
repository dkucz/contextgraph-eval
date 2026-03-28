const brokerConfig = require("../../config/broker");

function publishSensorEvent(event) {
  return {
    published: true,
    exchange: brokerConfig.exchangeName,
    routingKey: brokerConfig.routingKeys.sensorIngested,
    correlationId: event.correlationId,
    event,
  };
}

module.exports = {
  publishSensorEvent,
};
