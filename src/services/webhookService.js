function deliver() {
  return { delivered: false, reason: "Webhook delivery not configured." };
}

module.exports = {
  deliver,
};
