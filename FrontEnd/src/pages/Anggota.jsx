import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./Anggota.css";

function Anggota() {
  const [dataAnggota, setDataAnggota] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [namaAnggota, setNamaAnggota] = useState("");
  const [email, setEmail] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [alamat, setAlamat] = useState("");

  const ambilAnggota = async () => {
    try {
      const res = await api.get("/members");
      setDataAnggota(res.data.data);
    } catch (err) {
      setError("Gagal mengambil data anggota");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilAnggota();
  }, []);

  const resetForm = () => {
    setNamaAnggota("");
    setEmail("");
    setNomorTelepon("");
    setAlamat("");
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { namaAnggota, email, nomorTelepon, alamat };
      if (editId) {
        await api.put(`/members/${editId}`, payload);
      } else {
        await api.post("/members", payload);
      }
      resetForm();
      ambilAnggota();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan data anggota");
    }
  };

  const handleEdit = (anggota) => {
    setEditId(anggota._id);
    setNamaAnggota(anggota.namaAnggota);
    setEmail(anggota.email);
    setNomorTelepon(anggota.nomorTelepon);
    setAlamat(anggota.alamat);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus anggota ini?")) return;
    try {
      await api.delete(`/members/${id}`);
      ambilAnggota();
    } catch (err) {
      alert("Gagal menghapus anggota");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="anggota-container">
        <div className="anggota-header">
          <h2>Data Anggota</h2>
          <button onClick={() => { resetForm(); setShowForm(!showForm); }}>
            {showForm ? "Batal" : "+ Tambah Anggota"}
          </button>
        </div>

        {showForm && (
          <form className="anggota-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Nama anggota" value={namaAnggota} onChange={(e) => setNamaAnggota(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="text" placeholder="Nomor telepon" value={nomorTelepon} onChange={(e) => setNomorTelepon(e.target.value)} required />
            <input type="text" placeholder="Alamat" value={alamat} onChange={(e) => setAlamat(e.target.value)} required />
            <button type="submit">{editId ? "Update" : "Simpan"}</button>
          </form>
        )}

        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <table className="anggota-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>Alamat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataAnggota.map((anggota) => (
                <tr key={anggota._id}>
                  <td>{anggota.namaAnggota}</td>
                  <td>{anggota.email}</td>
                  <td>{anggota.nomorTelepon}</td>
                  <td>{anggota.alamat}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(anggota)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(anggota._id)}>Hapus</button>
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

export default Anggota;