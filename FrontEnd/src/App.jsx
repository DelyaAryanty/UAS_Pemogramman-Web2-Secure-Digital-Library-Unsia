import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SecurityRoute from "./components/SecurityRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import NotFound from "./pages/NotFound";
import Anggota from "./pages/Anggota";
import Peminjaman from "./pages/Loans";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <SecurityRoute>
                <Dashboard />
              </SecurityRoute>
            }
          />
          <Route
            path="/books"
            element={
              <SecurityRoute>
                <Books />
              </SecurityRoute>
            }
          />
          <Route
          path="/members"
          element={
          <SecurityRoute>
            <Anggota />
            </SecurityRoute>
          }
          />
          <Route
          path="/loans"
          element={
          <SecurityRoute>
            <Peminjaman />
            </SecurityRoute>
          }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;