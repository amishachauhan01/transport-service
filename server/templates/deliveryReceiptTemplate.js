exports.deliveryReceiptTemplate = (order) => `
Delivery Receipt

Order ID: ${order._id}
Customer: ${order.customer?.name}
Pickup: ${order.pickupLocation}
Delivery: ${order.deliveryLocation}
Status: ${order.status}
Date: ${new Date().toLocaleDateString()}
`;