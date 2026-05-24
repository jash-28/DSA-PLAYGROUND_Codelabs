import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to load courses ❌");
    }
  };

  // Fetch enrolled courses
  const fetchEnrolled = async () => {
    try {
      const res = await API.get("/courses/enrolled");
      const ids = res.data.map((c) => c._id);
      setEnrolledIds(ids);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrolled();
  }, []);

  // Enroll function
  const enrollCourse = async (id) => {
    try {
      await API.post(`/courses/enroll/${id}`);
      alert("Enrolled successfully ✅");
      fetchEnrolled();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.msg || "Enroll failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black">
      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-white">
          🎓 Student Dashboard
        </h1>

        {courses.length === 0 ? (
          <p className="text-gray-400">No courses available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <div className="h-40 w-full bg-gray-800">
                  <img
                    src={course.thumbnail || "/login.png"}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-semibold text-white">
                    {course.title}
                  </h2>

                  <p className="text-gray-400 mt-2 line-clamp-3">
                    {course.description}
                  </p>

                  {enrolledIds.includes(course._id) ? (
                    <button className="mt-4 bg-green-600 px-4 py-2 rounded cursor-not-allowed">
                      Enrolled ✅
                    </button>
                  ) : (
                    <button
                      onClick={() => enrollCourse(course._id)}
                      className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;