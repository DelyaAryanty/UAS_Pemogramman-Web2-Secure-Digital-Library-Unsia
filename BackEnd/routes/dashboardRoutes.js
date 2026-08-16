const express = require("express");
const router = express.Router();
const { summaryDashboard } = require("../controllers/dashboardController");
const protect = require("../middleware/authMiddleware");

router.get("/summary", protect, summaryDashboard);

module.exports = router;