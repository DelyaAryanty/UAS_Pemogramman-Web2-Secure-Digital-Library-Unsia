const mongoose = require("mongoose");

const informasiPeminjaman = new mongoose.Schema(
  {
    anggota: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: [true, "Mohon isi nama anda yang terdaftar sebagai anggota"],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Mohon untuk memilih buku yang akan dipinjam"],
    },
    tanggalPeminjamanBuku: {
      type: Date,
      default: Date.now,
    },
    tanggalPengembalianBuku: {
      type: Date,
      required: [true, "Mohon untuk mengisi tanggal pengembalian"],
    },
    aktualPengembalianBuku: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", informasiPeminjaman);