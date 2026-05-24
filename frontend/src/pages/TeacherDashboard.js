import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function TeacherDashboard() {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    thumbnail: null,
  });

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [module, setModule] = useState({
    title: "",
    content: "",
  });

  const [modules, setModules] = useState([]);

  // ================= CREATE COURSE =================
  const createCourse = async () => {
    try {
      const formData = new FormData();
      formData.append("title", course.title);
      formData.append("description", course.description);

      if (course.thumbnail) {
        formData.append("thumbnail", course.thumbnail);
      }

      await API.post("/courses/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Course created ✅");
      setCourse({ title: "", description: "", thumbnail: null });
      fetchCourses();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.msg || "Failed ❌");
    }
  };

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ================= ADD MODULE =================
  const addModule = async () => {
    try {
      await API.post("/modules/add", {
        ...module,
        course: selectedCourse,
      });

      alert("Module added ✅");
      setModule({ title: "", content: "" });
      fetchModules(selectedCourse);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.msg || "Module failed ❌");
    }
  };

  // ================= FETCH MODULES =================
  const fetchModules = async (courseId) => {
    try {
      const res = await API.get(`/modules/${courseId}`);
      setModules(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black text-white">
      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          👨‍🏫 Teacher Dashboard
        </h1>

        {/* ================= CREATE COURSE ================= */}
        <div className="bg-gray-900 p-6 rounded-xl mb-6">
          <h2 className="text-xl mb-4">Create Course</h2>

          <input
            className="w-full p-3 mb-3 rounded bg-gray-800 border border-gray-700 outline-none"
            placeholder="Course Title"
            value={course.title}
            onChange={(e) =>
              setCourse({ ...course, title: e.target.value })
            }
          />

          <textarea
            className="w-full p-3 mb-3 rounded bg-gray-800 border border-gray-700 outline-none"
            placeholder="Description"
            value={course.description}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />

          <input
            type="file"
            accept="image/*"
            className="w-full p-3 mb-3 rounded bg-gray-800 border border-gray-700 outline-none"
            onChange={(e) =>
              setCourse({ ...course, thumbnail: e.target.files[0] })
            }
          />

          <button
            onClick={createCourse}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Create Course
          </button>
        </div>

        {/* ================= COURSE LIST ================= */}
        <div className="bg-gray-900 p-6 rounded-xl mb-6">
          <h2 className="text-xl mb-4">Your Courses</h2>

          <div className="flex flex-wrap gap-3">
            {courses.map((c) => (
              <button
                key={c._id}
                onClick={() => {
                  setSelectedCourse(c._id);
                  fetchModules(c._id);
                }}
                className={`px-4 py-2 rounded ${
                  selectedCourse === c._id
                    ? "bg-blue-600"
                    : "bg-gray-700"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        {/* ================= ADD MODULE ================= */}
        {selectedCourse && (
          <div className="bg-gray-900 p-6 rounded-xl mb-6">
            <h2 className="text-xl mb-4">Add Module (Markdown)</h2>

            <input
              className="w-full p-3 mb-3 rounded bg-gray-800 border border-gray-700 outline-none"
              placeholder="Module Title"
              value={module.title}
              onChange={(e) =>
                setModule({ ...module, title: e.target.value })
              }
            />

            <textarea
              rows="6"
              className="w-full p-3 mb-3 rounded bg-gray-800 border border-gray-700 outline-none"
              placeholder="Write Markdown here..."
              value={module.content}
              onChange={(e) =>
                setModule({ ...module, content: e.target.value })
              }
            />

            <button
              onClick={addModule}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Add Module
            </button>
          </div>
        )}

        {/* ================= MODULE LIST ================= */}
        {modules.length > 0 && (
          <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="text-xl mb-4">Modules</h2>

            {modules.map((m, i) => (
              <div key={m._id} className="mb-4 border-b border-gray-700 pb-3">
                <h3 className="font-semibold">
                  {i + 1}. {m.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {m.content.substring(0, 80)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;