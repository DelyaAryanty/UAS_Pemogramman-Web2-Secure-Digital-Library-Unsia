const Book = require("../models/Book");

const dataBuku = async (req, res) => {
  try {
    const bukuTampil = await Book.find();

    res.status(200).json({
      success: true,
      data: bukuTampil,
    });
  } catch (error) {
    console.error("Tidak bisa menemukan buku", error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

const tambahBuku = async (req, res) => {
  try {
    const { judul, penulis, genre, isbn, tahunTerbit, stock } = req.body;

    const bukuBaru = await Book.create({
      judul,
      penulis,
      genre,
      isbn,
      tahunTerbit,
      stock,
      availableStock: stock,
    });

    res.status(201).json({
      success: true,
      message: "Buku berhasil ditambahkan",
      data: bukuBaru,
    });
  } catch (error) {
    console.error("Mohon Maaf, Anda Tidak dapat menambahkan buku", error);

    // Error validasi Mongoose / duplicate ISBN
    if (error.name === "ValidationError" || error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

const ubahBuku = async (req, res) => {
    try{
        const {id} = req.params;
        const{judul, penulis, genre, isbn, tahunTerbit, stock} = req.body;
        const bukuUpdate = await Book.findByIdAndUpdate(
            id,
            {
                judul,
                penulis,
                genre,
                isbn,
                tahunTerbit,
                stock,
                availableStock: stock,
            },
            {
                new: true,
                runValidators: true,
            }
        );
        if (!bukuUpdate){
            return res.status(404).json({
                success: false,
                message: "Buku tidak berhasil ditemukan"
            });
        }

        res.status(200).json({
            success: true,
            message: "Buku berhasil diubah",
            data: bukuUpdate,
        });
    } catch (error) {
        console.error("Tidak bisa mengubah buku", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
        });
     }
}

const hapusBuku = async (req, res) => {
  try {
    const {id} = req.params;

    const bukuHapus = await Book.findByIdAndDelete(id);

    if (!bukuHapus) {
      return res.status(404).json({
        success: false,
        message: "Buku tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Buku berhasil dihapus",
      data: bukuHapus,
    });
  } catch (error) {
    console.error("Tidak bisa menghapus buku", error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = {
  dataBuku,
  tambahBuku,
  ubahBuku,
  hapusBuku,
};