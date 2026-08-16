const express = require("express");
const router = express.Router();
const {
  dataAnggota,
  buatAnggota,
  updateAnggota,
  hapusAnggota,
} = require("../controllers/anggotaController");
const protect = require("../middleware/authMiddleware"); // sesuaikan nama file middleware kamu

router.get("/", protect, dataAnggota);
router.post("/", protect, buatAnggota);
router.put("/:id", protect, updateAnggota);
router.delete("/:id", protect, hapusAnggota);

module.exports = router;