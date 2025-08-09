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
import SchoolsList from "./pages/SchoolsList";
import SchoolDashboard from "./pages/SchoolDashboard";

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
      <Route
        path="/schools/:slug"
        element={
          <ProtectedRoute>
            <SchoolDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schools/:slug/students/new"
        element={
          <ProtectedRoute>
            <SchoolDashboard />
          </ProtectedRoute>
        }
      />
      {/* Allow Any Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/schools" element={<SchoolsList />} />
      {/* Error Pages */}
      <Route path="/unauthorized" element={<UnAuthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
