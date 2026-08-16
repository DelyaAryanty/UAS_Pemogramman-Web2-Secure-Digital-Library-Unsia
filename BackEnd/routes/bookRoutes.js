const express = require("express");
const { dataBuku, tambahBuku, ubahBuku, hapusBuku } = require("../controllers/bookController");
const keamanan = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", keamanan, dataBuku);
router.post("/", keamanan, tambahBuku);
router.put("/:id", keamanan, ubahBuku)
router.delete("/:id", keamanan, hapusBuku);

module.exports = router;