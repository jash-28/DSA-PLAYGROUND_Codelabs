import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signup = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/signup", form);

      alert(res.data.msg || "OTP sent 📩");

      navigate("/verify");

    } catch (err) {
      console.log(err.response?.data || err.message);

      alert(
        err.response?.data?.msg ||
        "Signup failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-blue-900 to-black p-4">

      <div className="flex w-full max-w-[980px] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex-col md:flex-row">

        {/* LEFT */}
        <div className="w-full md:w-1/2 p-8 md:p-10 text-white">

          {/* LOGO */}
          <div className="flex items-center gap-3 mb-6">

            <img
              src="/codelabs-logo.png"
              alt="CODE-LABS"
              className="w-12 h-12 rounded-xl"
            />

            <div>
              <h1 className="text-2xl font-bold tracking-wide">
                CODE-LABS
              </h1>

              <p className="text-gray-400 text-sm">
                Learn • Code • Grow
              </p>
            </div>

          </div>

          <h2 className="text-3xl font-bold mb-6">
            Create Account 🚀
          </h2>

          <input
            className="w-full p-3 mb-3 rounded bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            className="w-full p-3 mb-3 rounded bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
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
            className="w-full p-3 mb-3 rounded bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
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

          <select
            className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value,
              })
            }
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <button
            onClick={signup}
            disabled={loading}
            className="w-full bg-blue-600 p-3 rounded hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Signup"}
          </button>

          <p className="mt-4 text-sm text-gray-400">
            Already have account?{" "}

            <span
              onClick={() => navigate("/")}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-8">

          <img
            src="/signup.png"
            alt="signup"
            className="w-full max-w-[360px] rounded-2xl object-contain shadow-2xl"
          />

        </div>

      </div>

    </div>
  );
}

export default Signup;