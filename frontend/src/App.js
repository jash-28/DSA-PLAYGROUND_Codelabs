import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import Chat from "./pages/Chat";

// Dashboards
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

// Courses
import MyCourses from "./pages/MyCourses";
import CourseView from "./pages/CourseView";

// Editor
import CodeEditor from "./pages/CodeEditor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyOtp />} />

        {/* Student */}
        <Route path="/student" element={<StudentDashboard />} />

        {/* Courses */}
        <Route path="/courses" element={<MyCourses />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/course/:id" element={<CourseView />} />

        {/* Teacher */}
        <Route path="/teacher" element={<TeacherDashboard />} />

        {/* Editor */}
        <Route path="/editor" element={<CodeEditor />} />

        {/* Chat */}
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;