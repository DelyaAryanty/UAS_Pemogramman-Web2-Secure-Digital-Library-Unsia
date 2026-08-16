const mongoose = require("mongoose");

const identitasBuku = new mongoose.Schema(
  {
    judul: {
      type: String,
      required: [true, "Mohon isi judul buku"],
      trim: true,
    },

    penulis: {
      type: String,
      required: [true, "Mohon isi penulis buku"],
      trim: true,
    },

    genre: {
      type: String,
      required: [true, "Mohon isi kategori buku"],
      trim: true,
    },

    isbn: {
      type: String,
      required: [true, "Mohon isi nomor ISBN"],
      unique: true,
      trim: true,
    },

    tahunTerbit: {
      type: Number,
      required: [true, "Mohon isi tahun terbit buku"],
    },

    stock: {
      type: Number,
      required: [true, "Mohon isi jumalah ketersediaan buku"],
      min: 0,
      default: 0,
    },

    availableStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", identitasBuku);