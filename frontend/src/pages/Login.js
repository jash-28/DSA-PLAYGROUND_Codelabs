import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      if (!res.data.token) {
        alert(res.data.msg || "Verify OTP first 📩");
        navigate("/verify");
        return;
      }

      localStorage.clear();

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);

      if (res.data.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.msg || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-blue-900 to-black p-4">
      <div className="flex w-full max-w-[980px] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full md:w-1/2 p-8 md:p-10 text-white">
          <h2 className="text-3xl font-bold mb-6">Welcome Back 👋</h2>

          <input
            className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-700 outline-none"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-700 outline-none"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-blue-600 p-3 rounded hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-sm text-gray-400">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Signup
            </span>
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full md:w-1/2 bg-blue-800 flex items-center justify-center p-8">
          <img
            src="/login.png"
            alt="education"
            className="w-full max-w-[360px] rounded-xl object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;