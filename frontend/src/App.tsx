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
import NewsList from "./pages/NewsList";
import NewsDetail from "./pages/NewsDetail";
import Panel from "./pages/Panel";
import Classroom from "./pages/Classroom";

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
        path="/schools/:slug/students/new"
        element={
          <ProtectedRoute>
            <SchoolDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schools/:slug/panel"
        element={
          <ProtectedRoute>
            <Panel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schools/:slug/grades/:gradeid/classrooms/:classroomid/"
        element={
          <ProtectedRoute>
            <Classroom />
          </ProtectedRoute>
        }
      />
      {/* Allow Any Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/schools" element={<SchoolsList />} />
      <Route path="/schools/:slug" element={<SchoolDashboard />} />
      <Route path="/schools/:slug/news" element={<NewsList />} />
      <Route path="/schools/:slug/news/:newsslug" element={<NewsDetail />} />
      {/* Error Pages */}
      <Route path="/unauthorized" element={<UnAuthorized />} />
      <Route path="/schools/:slug/*" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
