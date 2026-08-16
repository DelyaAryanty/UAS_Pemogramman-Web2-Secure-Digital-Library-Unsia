const Loan = require("../models/Loan");
const Book = require("../models/Book");

const dataPeminjaman = async (req, res) => {
  try {
    const peminjaman = await Loan.find()
      .populate("anggota", "namaAnggota email")
      .populate("book", "judul penulis");

    res.status(200).json({
      success: true,
      data: peminjaman,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

const peminjamanBaru = async (req, res) => {
  try {
    const { book, anggota, tanggalPengembalianBuku } = req.body;

    const bukuDipilih = await Book.findById(book);

    if (!bukuDipilih) {
      return res.status(404).json({
        success: false,
        message: "Buku tidak ditemukan",
      });
    }

    if (bukuDipilih.availableStock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Stok buku habis",
      });
    }

    const listPeminjamanBaru = await Loan.create({
      book,
      anggota,
      tanggalPengembalianBuku,
    });

    bukuDipilih.availableStock -= 1;
    await bukuDipilih.save();

    res.status(201).json({
      success: true,
      data: listPeminjamanBaru,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const listPengembalian = async (req, res) => {
  try {
    const peminjaman = await Loan.findById(req.params.id);

    if (!peminjaman) {
      return res.status(404).json({
        success: false,
        message: "Data peminjaman tidak ditemukan",
      });
    }

    if (peminjaman.status === "returned") {
      return res.status(400).json({
        success: false,
        message: "Buku sudah dikembalikan sebelumnya",
      });
    }

    peminjaman.status = "returned";
    peminjaman.aktualPengembalianBuku = Date.now();

    await peminjaman.save();

    const buku = await Book.findById(peminjaman.book);

    if (buku) {
      buku.availableStock += 1;
      await buku.save();
    }

    res.status(200).json({
      success: true,
      data: peminjaman,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = {
  dataPeminjaman,
  peminjamanBaru,
  listPengembalian,
};