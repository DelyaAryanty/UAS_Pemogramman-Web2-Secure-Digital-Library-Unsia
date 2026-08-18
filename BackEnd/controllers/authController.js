const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi",
      });
    }
    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );

    res.status(200).json({
        success: true,
        message: "Login berhasil",
        token,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

const profil = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

const editPassword = async (req, res) => {
  try {
    const { passwordLama, passwordBaru } = req.body;

    if (!passwordLama || !passwordBaru) {
      return res.status(400).json({
        success: false,
        message: "Password lama dan password baru wajib diisi",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const passwordSesuai = await bcrypt.compare(
      passwordLama,
      user.password
    );

    if (!passwordSesuai) {
      return res.status(401).json({
        success: false,
        message: "Password lama salah",
      });
    }

    const passwordBaruHash = await bcrypt.hash(passwordBaru, 10);

    user.password = passwordBaruHash;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password berhasil diubah",
    });
  } catch (error) {
    console.error("Tidak bisa mengubah password", error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = {
  register,
  login,
  profil,
  editPassword,
};
