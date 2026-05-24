import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses/enrolled");

        console.log("Courses:", res.data); // 🔥 DEBUG

        setCourses(res.data);

      } catch (err) {
        console.log("ERROR:", err.response?.data);
        alert("Failed to load courses ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black text-white">

      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl mb-6">📚 My Courses</h1>

        {courses.length === 0 ? (
          <p>No enrolled courses</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-gray-900 p-5 rounded-xl shadow"
              >
                <h2 className="text-xl mb-2">{course.title}</h2>
                <p className="text-gray-400 mb-3">
                  {course.description}
                </p>

                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="bg-blue-600 px-4 py-2 rounded"
                >
                  Open Course →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCourses;