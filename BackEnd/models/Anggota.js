const mongoose = require("mongoose");

const identitasAnggota = new mongoose.Schema(
  {
    namaAnggota: {
      type: String,
      required: [true, "Mohon untuk mengisi nama"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Mohon untuk mengisi email"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    nomorTelepon: {
      type: String,
      required: [true, "Mohon untuk mengisi nomor telepon"],
      trim: true,
    },

    alamat: {
      type: String,
      required: [true, "Mohon untuk mengisi alamat"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Member", identitasAnggota);