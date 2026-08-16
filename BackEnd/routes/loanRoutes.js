const express = require("express");
const router = express.Router();
const {
  dataPeminjaman,
  peminjamanBaru,
  listPengembalian,
} = require("../controllers/loanController");

const keamanan = require("../middleware/authMiddleware");

router.get("/", keamanan, dataPeminjaman);
router.post("/", keamanan, peminjamanBaru);
router.put("/:id/return", keamanan, listPengembalian);

module.exports = router;