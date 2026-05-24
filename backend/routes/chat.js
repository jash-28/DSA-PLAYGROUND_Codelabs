{messages.map((m, i) => {
  const isMe = m.sender._id === currentUser;

  return (
    <div
      key={i}
      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-xl ${
          isMe
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-white"
        }`}
      >

        {/* NAME */}
        <p className="text-xs text-gray-300 mb-1">
          {isMe
            ? "👨‍🎓 You"
            : m.sender.role === "teacher"
            ? "👨‍🏫 Teacher"
            : "👨‍🎓 Student"}
        </p>

        {/* MESSAGE */}
        <p>{m.text}</p>

      </div>
    </div>
  );
})}