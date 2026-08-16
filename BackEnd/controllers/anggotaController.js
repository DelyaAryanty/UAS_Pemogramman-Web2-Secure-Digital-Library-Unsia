const Member = require("../models/Anggota");

const dataAnggota = async (req, res) => {
  try {
    const anggotaTampil = await Member.find();

    res.status(200).json({
      success: true,
      data: anggotaTampil,
    });
  } catch (error) {
    console.error("Tidak bisa menemukan data anggota", error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

const buatAnggota = async (req, res) => {
  try {
    const anggotaBaru = await Member.create(req.body);
    res.status(201).json({ success: true, data: anggotaBaru });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateAnggota = async (req, res) => {
  try {
    const anggotaUpdate = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!anggotaUpdate) {
      return res.status(404).json({ success: false, message: "Anggota tidak ditemukan" });
    }
    res.status(200).json({ success: true, data: anggotaUpdate });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const hapusAnggota = async (req, res) => {
  try {
    const anggotaHapus = await Member.findByIdAndDelete(req.params.id);
    if (!anggotaHapus) {
      return res.status(404).json({ success: false, message: "Anggota tidak ditemukan" });
    }
    res.status(200).json({ success: true, message: "Anggota berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
};

module.exports = {
  dataAnggota,
  buatAnggota,
  updateAnggota,
  hapusAnggota,
};