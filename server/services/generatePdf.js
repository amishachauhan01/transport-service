const PDFDocument = require("pdfkit");

const generatePdf = (order, res) => {
  const doc = new PDFDocument();

  // response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`
  );

  doc.pipe(res);

  // =====================
  // HEADER
  // =====================
  doc.fontSize(18).text("Transport Invoice", { align: "center" });

  doc.moveDown();

  // =====================
  // ORDER DETAILS
  // =====================
  doc.fontSize(12);
  doc.text(`Order ID: ${order._id}`);
  doc.text(`Customer: ${order.customer.name}`);
  doc.text(`Pickup: ${order.pickupLocation}`);
  doc.text(`Delivery: ${order.deliveryLocation}`);
  doc.text(`Status: ${order.status}`);

  doc.end();
};

module.exports = generatePdf;