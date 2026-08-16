import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./Books.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [tahunTerbit, setTahunTerbit] = useState("");
  const [stock, setStock] = useState("");

  const ambilBuku = async () => {
    try {
      setError("");

      const res = await api.get("/books");
      setBooks(res.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data buku:", err);
      setError(
        err.response?.data?.message ||
          "Gagal mengambil data buku"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilBuku();
  }, []);

  const resetForm = () => {
    setJudul("");
    setPenulis("");
    setGenre("");
    setIsbn("");
    setTahunTerbit("");
    setStock("");
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pastikan semua input terisi
    if (
      !judul.trim() ||
      !penulis.trim() ||
      !genre.trim() ||
      !isbn.trim() ||
      !tahunTerbit ||
      stock === ""
    ) {
      alert("Semua data buku wajib diisi.");
      return;
    }

    const tahun = Number(tahunTerbit);
    const jumlahStock = Number(stock);

    if (tahun <= 0) {
      alert("Tahun terbit tidak valid.");
      return;
    }

    if (jumlahStock < 0) {
      alert("Jumlah buku tidak boleh kurang dari 0.");
      return;
    }

    const payload = {
      judul: judul.trim(),
      penulis: penulis.trim(),
      genre: genre.trim(),
      isbn: isbn.trim(),
      tahunTerbit: tahun,
      stock: jumlahStock,
    };

    console.log("DATA YANG DIKIRIM:", payload);

    try {
      if (editId) {
        await api.put(`/books/${editId}`, payload);
        alert("Buku berhasil diubah.");
      } else {
        await api.post("/books", payload);
        alert("Buku berhasil ditambahkan.");
      }

      resetForm();
      setLoading(true);
      await ambilBuku();
    } catch (err) {
      console.error("Gagal menyimpan buku:", err);

      alert(
        err.response?.data?.message ||
          "Gagal menyimpan data buku"
      );
    }
  };

  const handleEdit = (buku) => {
    setEditId(buku._id);
    setJudul(buku.judul || "");
    setPenulis(buku.penulis || "");
    setGenre(buku.genre || "");
    setIsbn(buku.isbn || "");
    setTahunTerbit(buku.tahunTerbit || "");
    setStock(buku.stock ?? "");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus buku ini?")) {
      return;
    }

    try {
      await api.delete(`/books/${id}`);
      alert("Buku berhasil dihapus.");
      ambilBuku();
    } catch (err) {
      console.error("Gagal menghapus buku:", err);

      alert(
        err.response?.data?.message ||
          "Gagal menghapus buku"
      );
    }
  };

  return (
    <div>
      <Navbar />

      <div className="books-container">
        <div className="books-header">
          <h2>Data Buku</h2>

          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
          >
            {showForm ? "Batal" : "+ Tambah Buku"}
          </button>
        </div>

        {showForm && (
          <form
            className="book-form"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Judul buku"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Penulis"
              value={penulis}
              onChange={(e) =>
                setPenulis(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Tahun Terbit"
              value={tahunTerbit}
              onChange={(e) =>
                setTahunTerbit(e.target.value)
              }
              required
            />

            <input
              type="number"
              placeholder="Jumlah Buku"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
              required
            />

            <button type="submit">
              {editId ? "Update" : "Simpan"}
            </button>
          </form>
        )}

        {loading && <p>Loading...</p>}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {!loading && !error && (
          <table className="books-table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Penulis</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Tahun</th>
                <th>Jumlah Buku</th>
                <th>Stok Tersedia</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {books.map((buku) => (
                <tr key={buku._id}>
                  <td>{buku.judul}</td>
                  <td>{buku.penulis}</td>
                  <td>{buku.genre}</td>
                  <td>{buku.isbn}</td>
                  <td>{buku.tahunTerbit}</td>
                  <td>{buku.stock}</td>
                  <td>{buku.availableStock}</td>

                  <td>
                    <button
                      className="btn-edit"
                      onClick={() =>
                        handleEdit(buku)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() =>
                        handleDelete(buku._id)
                      }
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Books;