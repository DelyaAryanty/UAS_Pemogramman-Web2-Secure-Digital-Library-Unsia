import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./Loans.css";

function Peminjaman() {
  const [dataPeminjaman, setDataPeminjaman] = useState([]);
  const [books, setBooks] = useState([]);
  const [anggotaList, setAnggotaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [book, setBook] = useState("");
  const [anggota, setAnggota] = useState("");
  const [tanggalPengembalianBuku, setTanggalPengembalianBuku] = useState("");

  const ambilData = async () => {
    try {
      const [resPeminjaman, resBooks, resAnggota] = await Promise.all([
        api.get("/loans"),
        api.get("/books"),
        api.get("/members"),
      ]);
      setDataPeminjaman(resPeminjaman.data.data);
      setBooks(resBooks.data.data);
      setAnggotaList(resAnggota.data.data);
    } catch (err) {
      setError("Gagal mengambil data peminjaman");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilData();
  }, []);

  const resetForm = () => {
    setBook("");
    setAnggota("");
    setTanggalPengembalianBuku("");
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/loans", { book, anggota, tanggalPengembalianBuku });
      resetForm();
      ambilData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mencatat peminjaman");
    }
  };

  const handleKembalikan = async (id) => {
    if (!window.confirm("Konfirmasi buku sudah dikembalikan?")) return;
    try {
      await api.put(`/loans/${id}/return`);
      ambilData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memproses pengembalian");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="peminjaman-container">
        <div className="peminjaman-header">
          <h2>Data Peminjaman</h2>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }}>
            {showForm ? "Batal" : "+ Catat Peminjaman"}
          </button>
        </div>

        {showForm && (
          <form className="peminjaman-form" onSubmit={handleSubmit}>
            <select value={book} onChange={(e) => setBook(e.target.value)} required>
              <option value="">Pilih Buku</option>
              {books.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.judul} (stok: {b.stock})
                </option>
              ))}
            </select>

            <select value={anggota} onChange={(e) => setAnggota(e.target.value)} required>
              <option value="">Pilih Anggota</option>
              {anggotaList.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.namaAnggota}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={tanggalPengembalianBuku}
              onChange={(e) => setTanggalPengembalianBuku(e.target.value)}
              required
            />

            <button type="submit">Simpan</button>
          </form>
        )}

        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="peminjaman-table">
            <thead>
              <tr>
                <th>Buku</th>
                <th>Anggota</th>
                <th>Tgl Pinjam</th>
                <th>Batas Kembali</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataPeminjaman.map((pinjam) => (
                <tr key={pinjam._id}>
                  <td>{pinjam.book?.judul || pinjam.book?.title || "-"}</td>
                  <td>{pinjam.anggota?.namaAnggota || "-"}</td>
                  <td>{new Date(pinjam.tanggalPeminjamanBuku).toLocaleDateString("id-ID")}</td>
                  <td>{new Date(pinjam.tanggalPengembalianBuku).toLocaleDateString("id-ID")}</td>
                  <td>
                    <span className={pinjam.status === "borrowed" ? "status-borrowed" : "status-returned"}>
                      {pinjam.status === "borrowed" ? "Dipinjam" : "Dikembalikan"}
                    </span>
                  </td>
                  <td>
                    {pinjam.status === "borrowed" && (
                      <button className="btn-return" onClick={() => handleKembalikan(pinjam._id)}>
                        Kembalikan
                      </button>
                    )}
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

export default Peminjaman;