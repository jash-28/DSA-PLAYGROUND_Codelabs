import { useEffect, useRef, useState, useCallback } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  const currentUserId = localStorage.getItem("userId");
  const currentUserName = localStorage.getItem("name") || "You";
  const currentUserRole = localStorage.getItem("role") || "user";

  const bottomRef = useRef(null);

  // ================= FETCH USERS =================
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await API.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.log("FETCH USERS ERROR:", err.response?.data || err.message);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // ================= FETCH MESSAGES =================
  const fetchMessages = useCallback(async () => {
    try {
      if (!selectedUser?._id) return;

      const res = await API.get(`/messages/${selectedUser._id}`);
      setMessages(res.data || []);
    } catch (err) {
      console.log("FETCH MESSAGES ERROR:", err.response?.data || err.message);
    }
  }, [selectedUser]);

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    try {
      if (!selectedUser?._id) {
        alert("Select a user first");
        return;
      }

      if (!text.trim()) return;

      const res = await API.post("/messages/send", {
        receiver: selectedUser._id,
        text,
      });

      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.log("SEND MESSAGE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Message failed ❌");
    }
  };

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================= LOAD USERS ONCE =================
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ================= LOAD + POLL MESSAGES =================
  useEffect(() => {
    if (!selectedUser?._id) return;

    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedUser, fetchMessages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* ================= LEFT SIDEBAR ================= */}
          <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden md:col-span-1">
            <div className="p-4 border-b border-gray-800">
              <h1 className="text-xl font-bold">💬 Chats</h1>
              <p className="text-gray-400 text-sm mt-1">
                Logged in as {currentUserName} ({currentUserRole})
              </p>
            </div>

            <div className="max-h-[650px] overflow-y-auto">
              {loadingUsers ? (
                <div className="p-4 text-gray-400">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="p-4 text-gray-400">No users found</div>
              ) : (
                users.map((user) => {
                  const active = selectedUser?._id === user._id;

                  return (
                    <button
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      className={`w-full text-left p-4 border-b border-gray-800 transition ${
                        active
                          ? "bg-blue-600"
                          : "bg-gray-900 hover:bg-gray-800"
                      }`}
                    >
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-xs text-gray-300">
                        {user.role} • {user.email}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ================= CHAT AREA ================= */}
          <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden md:col-span-3 flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-gray-800">
              <h2 className="text-2xl font-bold">
                {selectedUser ? selectedUser.name : "Select a user"}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {selectedUser
                  ? `${selectedUser.role} • ${selectedUser.email}`
                  : "Teacher ↔ Student messaging"}
              </p>
            </div>

            {/* Messages */}
            <div className="bg-gray-950 h-[520px] overflow-y-auto p-5 space-y-4">
              {!selectedUser ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Choose a user from the left to start chatting
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No messages yet
                </div>
              ) : (
                messages.map((m) => {
                  const senderId =
                    typeof m.sender === "object" ? m.sender?._id : m.sender;

                  const isMe = String(senderId) === String(currentUserId);

                  return (
                    <div
                      key={m._id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-lg ${
                          isMe
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-gray-700 text-white rounded-bl-sm"
                        }`}
                      >
                        <p className="text-xs text-gray-200 mb-1">
                          {isMe
                            ? `${currentUserName} (${currentUserRole})`
                            : `${m.sender?.name || "User"} (${
                                m.sender?.role || "student"
                              })`}
                        </p>

                        <p className="text-sm break-words">{m.text}</p>

                        <p className="text-[10px] text-gray-300 mt-2 text-right">
                          {m.createdAt
                            ? new Date(m.createdAt).toLocaleTimeString()
                            : ""}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="bg-gray-900 p-4 border-t border-gray-800 flex gap-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  selectedUser
                    ? `Message ${selectedUser.name}...`
                    : "Select a user first"
                }
                disabled={!selectedUser}
                className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700 outline-none disabled:opacity-50"
              />

              <button
                onClick={sendMessage}
                disabled={!selectedUser}
                className="bg-blue-600 px-6 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;