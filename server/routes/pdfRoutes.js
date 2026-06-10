const express = require("express");
const router = express.Router();

const { downloadInvoice } = require("../controllers/pdfController");
const { protect } = require("../middleware/authMiddleware");

router.get("/invoice/:id", protect, downloadInvoice);

module.exports = router;
