import { Routes, Route } from "react-router";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/Homepage";
import LogOut from "./pages/LogOut";
import ProtectedRoute from "./routes/ProtectedRoute";
import RegisterSchool from "./pages/RegisterSchool";
import UnAuthorized from "./pages/UnAuthorized";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<LogOut />} />
      <Route path="/register" element={<Register />} />
      {/* Auth Protected Pages (Need Authentication) */}
      <Route
        path="/schools/register"
        element={
          <ProtectedRoute>
            <RegisterSchool />
          </ProtectedRoute>
        }
      />
      {/* Home Page */}
      <Route path="/" element={<HomePage />} />
      {/* Error Pages */}
      <Route path="/unauthorized" element={<UnAuthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
