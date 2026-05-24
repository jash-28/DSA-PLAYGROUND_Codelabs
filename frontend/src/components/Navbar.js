import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-black text-white shadow">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/student")}>
        DSA Playground
      </h1>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/my-courses")}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          My Courses
        </button>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
        <button
  onClick={() => navigate("/chat")}
  className="bg-blue-600 px-4 py-2 rounded"
>
  Open Chat 💬
</button>
      </div>
    </div>
  );
}

export default Navbar;