exports.orderCreatedTemplate = (order) => `
  <h2>Order Created Successfully 🚚</h2>
  <p>Order ID: ${order._id}</p>
  <p>Pickup: ${order.pickupLocation}</p>
  <p>Delivery: ${order.deliveryLocation}</p>
  <p>Status: ${order.status}</p>
`;