import { Routes, Route } from "react-router";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      /> */}
    </Routes>
  );
}

export default App;
