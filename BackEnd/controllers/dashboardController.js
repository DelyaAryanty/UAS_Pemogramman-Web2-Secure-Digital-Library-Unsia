const Book = require("../models/Book");
const Member = require("../models/Anggota");
const Loan = require("../models/Loan");

const summaryDashboard = async (req, res) => {
  try {
    const totalBuku = await Book.countDocuments();
    const totalAnggota = await Member.countDocuments();
    const totalPeminjaman = await Loan.countDocuments();
    const sedangDipinjam = await Loan.countDocuments({ status: "borrowed" });

    const bukuTersedia = await Book.aggregate([
      { $group: { _id: null, total: { $sum: "$availableStock" } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBuku,
        totalAnggota,
        totalPeminjaman,
        sedangDipinjam,
        bukuTersedia: bukuTersedia[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
};

module.exports = { summaryDashboard };