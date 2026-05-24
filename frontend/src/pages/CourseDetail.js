import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function CourseDetail() {
  const { id } = useParams();
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await API.get(`/modules/${id}`);
        setModules(res.data);
      } catch (err) {
        console.log(err.response?.data);
        alert("Failed to load modules ❌");
      }
    };

    fetchModules();
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
          📖 Course Content
        </h1>

        {modules.length === 0 ? (
          <p className="text-gray-400">No modules found</p>
        ) : (
          modules.map((m) => (
            <div
              key={m._id}
              className="mb-6 bg-gray-900 p-5 rounded-xl"
            >
              <h2 className="text-xl mb-3 font-semibold">
                {m.title}
              </h2>

              {/* Markdown Content */}
              <div className="prose prose-invert">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>

              {/* 🔥 Button to go to coding problems */}
              <button
                onClick={() => navigate(`/editor?module=${m._id}`)}
                className="mt-4 bg-blue-600 px-4 py-2 rounded"
              >
                Solve Problems →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CourseDetail;