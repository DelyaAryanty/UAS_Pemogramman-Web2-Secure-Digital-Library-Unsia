import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { logout } = useAuth();
  const navigasi = useNavigate();

  const handleLogout = () => {
    logout();
    navigasi("/login");
  };

  return (
    <nav className="navbar">
      <h3 className="navbar-title">UNSIA Digital Library</h3>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/books">Data Buku</Link>
        <Link to="/members">Data Anggota</Link>
        <Link to="/loans">Peminjaman</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;