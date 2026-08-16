import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [ringkasan, setRingkasan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ambilData = async () => {
      try {
        const res = await api.get("/dashboard/summary");
        setRingkasan(res.data.data);
      } catch (err) {
        setError("Gagal mengambil data dashboard");
      } finally {
        setLoading(false);
      }
    };
    ambilData();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: "40px", color: "red" }}>{error}</p>;

  const chartData = {
    labels: ["Total Buku", "Buku Tersedia", "Total Anggota", "Total Peminjaman", "Sedang Dipinjam"],
    datasets: [
      {
        label: "Ringkasan Perpustakaan",
        data: [
          ringkasan.totalBuku,
          ringkasan.bukuTersedia,
          ringkasan.totalAnggota,
          ringkasan.totalPeminjaman,
          ringkasan.sedangDipinjam,
        ],
        backgroundColor: ["#574964", "#9F8383", "#C8AAAA", "#FFDAB3", "#7D6E83"],
      },
    ],
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h2>Dashboard</h2>

        <div className="card-grid">
          <div className="summary-card">
            <p className="card-label">Total Buku</p>
            <p className="card-value">{ringkasan.totalBuku}</p>
          </div>
          <div className="summary-card">
            <p className="card-label">Total Anggota</p>
            <p className="card-value">{ringkasan.totalAnggota}</p>
          </div>
          <div className="summary-card">
            <p className="card-label">Total Peminjaman</p>
            <p className="card-value">{ringkasan.totalPeminjaman}</p>
          </div>
        </div>

        <div className="chart-container">
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;