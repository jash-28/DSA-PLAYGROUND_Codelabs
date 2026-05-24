import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import API from "../services/api";
import Navbar from "../components/Navbar";

function CourseView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseThumbnail, setCourseThumbnail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const moduleRes = await API.get(`/modules/${id}`);
        setModules(moduleRes.data || []);

        try {
          const courseRes = await API.get(`/courses/${id}`);
          setCourseTitle(courseRes.data?.title || "Course");
          setCourseThumbnail(courseRes.data?.thumbnail || "");
        } catch (courseErr) {
          console.log("Course fetch error:", courseErr.response?.data || courseErr.message);
          setCourseTitle("Course");
          setCourseThumbnail("");
        }
      } catch (err) {
        console.log("Module fetch error:", err.response?.data || err.message);
        setError("Failed to load course ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <h2 className="text-xl">Loading course...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black text-white">
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto">
        {/* Course Header */}
        <div className="mb-8 bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
          {courseThumbnail ? (
            <img
              src={courseThumbnail}
              alt={courseTitle}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center">
              <span className="text-2xl font-bold text-white/80">
                DSA Playground
              </span>
            </div>
          )}

          <div className="p-6">
            <h1 className="text-3xl font-bold">{courseTitle || "Course Content"}</h1>
            <p className="text-gray-400 mt-2">
              Learn step by step with modules and practice problems
            </p>
          </div>
        </div>

        {/* No Modules */}
        {modules.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 bg-gray-900 p-6 rounded-xl">
            No modules available yet
          </div>
        ) : (
          <div className="space-y-6">
            {modules.map((module, index) => (
              <div
                key={module._id}
                className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-blue-500/20 transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">
                    📌 Module {index + 1}: {module.title}
                  </h2>

                  <span className="text-sm text-gray-400">
                    #{index + 1}
                  </span>
                </div>

                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{module.content}</ReactMarkdown>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => navigate(`/editor?module=${module._id}`)}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                  >
                    💻 Solve Problems
                  </button>

                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                  >
                    ⬆ Back to Top
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseView;