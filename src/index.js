const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const {
  addUsers,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");
const { generateMessage, generateLocation } = require("./utils/messages");

const app = express();
const server = http.createServer(app);

//UPGRADING TO WSS
const io = socketio(server);

//ASSIGNING PORT
const port = process.env.port || 3000;

const staticpath = path.join(__dirname, "../public");
app.use(express.static(staticpath));

//New Connection
io.on("connection", (socket) => {
  console.log("WS connection...");
  socket.on("join", ({ username, room }) => {
    const user = addUsers(socket.id, username, room);
    socket.join(user.room);
    socket.emit("message", generateMessage("Admin", "Welcome!"));
    // if (error) return alert(error);
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage(user.username, `${user.username} has joined!`)
      );
    io.to(user.room).emit("UsersInRoom", getUsersInRoom(user.room));
  });

  //Send chat message
  socket.on("sendmessage", (message) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", generateMessage(user.username, message));
  });

  // Send location
  socket.on("locationmessage", ({ latitude, longitude }) => {
    const user = getUser(socket.id);
    socket.emit(
      "messageLocation",
      generateLocation(user.username, { latitude, longitude })
    );
  });

  //User has left
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left the chat!`)
      );
      io.to(user.room).emit("UsersInRoom", getUsersInRoom(user.room));
    }
  });
});
server.listen(port, () => console.log(`running on port ${port}`));
