import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.post("/auth/login", { email, password });
            login(res.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login gagal, coba lagi");
        } finally {
            setLoading(false);
        }
    };
    return (
    <div className="login-container">
        <h2>Login</h2>
        <p className="welcome-text">
        Hallo mahasiswa, silahkan login untuk masuk ke UNSIA Digital Library
         </p>
         {error && <p className="error-message">{error}</p>}
         <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Email</label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
        </form>
        <p className="switch-link">
            Silahkan untuk melakukan <Link to="/register">Sign Up</Link> jika belum memiliki akun
            </p>
            </div>
            );
}

export default Login;