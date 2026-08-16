const express = require("express");
const {register,login,profil,editPassword,} = require("../controllers/authController");
const keamanan = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", keamanan, profil);
router.put("/password", keamanan, editPassword);

module.exports = router;