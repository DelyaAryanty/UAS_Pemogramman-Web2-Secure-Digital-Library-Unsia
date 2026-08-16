const User = require("../models/User");

const jumlahPengguna = async (req, res) => {
  try {
    const jumlahUser = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        jumlahUser,
      },
    });
  } catch (error) {
    console.error("Tidak bisa menghitung jumlah pengguna", error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = {
  jumlahPengguna,
};