module.exports = (io) => {

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join room (course or private)
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
    });

    // Send message
    socket.on("send_message", (data) => {
      io.to(data.room).emit("receive_message", data);
    });
    
    // Disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

};