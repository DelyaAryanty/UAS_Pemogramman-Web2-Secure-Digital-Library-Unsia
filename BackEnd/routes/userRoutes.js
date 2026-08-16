const express = require("express");
const { jumlahPengguna } = require("../controllers/userController");
const keamanan = require("../middleware/authMiddleware");
const adminKeamanan = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/count", keamanan, adminKeamanan, jumlahPengguna);

module.exports = router;