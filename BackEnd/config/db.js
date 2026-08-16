const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Selamat MongoDB Sudah Terhubung");
  } catch (error) {
    console.error("Maaf, Koneksi MongoDB gagal Terhubung:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB; 