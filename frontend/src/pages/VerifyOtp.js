import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function VerifyOtp() {
  const [data, setData] = useState({
    email: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const verify = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/verify-otp", data);

      alert(res.data.msg || "Verified ✅");
      navigate("/");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.msg || "Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-blue-900 to-black p-4">
      <div className="flex w-full max-w-[980px] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full md:w-1/2 p-8 md:p-10 text-white">
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/codelabs-logo.png"
              alt="CODE-LABS"
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-wide">CODE-LABS</h1>
              <p className="text-gray-400 text-sm">Secure Email Verification</p>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Verify Email 📩
          </h2>

          <input
            className="w-full p-4 mb-4 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
            placeholder="Email"
            value={data.email}
            onChange={(e) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
          />

          <input
            className="w-full p-4 mb-5 rounded-xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
            placeholder="Enter OTP"
            value={data.otp}
            onChange={(e) =>
              setData({
                ...data,
                otp: e.target.value,
              })
            }
          />

          <button
            onClick={verify}
            disabled={loading}
            className="w-full bg-blue-600 p-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <p className="mt-5 text-sm text-gray-400">
            Back to{" "}
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
            alt="education"
            className="w-full max-w-[380px] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;