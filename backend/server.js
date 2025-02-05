const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5001; // Use environment variable or default to 3001

// Middleware
app.use(cors());
app.use(express.json()); // Enable JSON parsing

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5000", // Frontend URL from env
    methods: ["GET", "POST"],
  },
});

app.use(cors());

let queue = []; // Queue to hold waiting users
let rooms = {}; // Stores active rooms

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Add user to the queue
  queue.push(socket);
  console.log("User added to queue:", socket.id);

  // Try to pair users
  matchUsers();

  socket.on("send_message", ({ room, message }) => {
    try {
      const roomUsers = findUsers(room); // Function to get users in the room
      if (roomUsers.length !== 2) {
        console.error("Message send error: Room does not have two users.");
        return;
      }

      const recipient = roomUsers.find((user) => user.id !== socket.id); // Find the other user
      if (recipient) {
        recipient.emit("receive_message", "Anonymous: " + message); // Send message only to the other user
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("swap", () => {
    try {
      // get both users in the room
      const room = rooms[socket.id];
      const roomusers = findUsers(room);
      // remove users from room, add them to queue, then try matchUsers
      roomusers.forEach((user) => {
        user.leave(room);
        delete rooms[user.id];
        queue.push(user);
      });
      matchUsers();
    } catch (error) {
      console.error("Error during swap:", error);
    }
  });

  socket.on("disconnect", () => {
    try {
      console.log("User disconnected:", socket.id);
      removeFromQueue(socket);
      removeFromRooms(socket);
      matchUsers(); // Try to match new users
    } catch (error) {
      console.error("Error during disconnect:", error);
    }
  });

  socket.on("disconnectUser", () => {
    try {
      console.log("User disconnected:", socket.id);
      removeFromQueue(socket);
      removeFromRooms(socket);
      matchUsers(); // Try to match new users
    } catch (error) {
      console.error("Error during disconnect:", error);
    }
  });
});

function findUsers(room) {
  const users = [];
  io.sockets.sockets.forEach((socket) => {
    if (rooms[socket.id] === room) {
      users.push(socket);
    }
  });
  return users;
}

function matchUsers() {
  console.log(queue.length, "users in queue");
  while (queue.length >= 2) {
    const user1 = queue.shift();
    const user2 = queue.shift();
    const room = `room-${uuidv4()}`; // Use UUID for unique room names

    rooms[user1.id] = room;
    rooms[user2.id] = room;

    user1.join(room);
    user2.join(room);

    // Send room ID to both users
    user1.emit("match_room", room);
    user2.emit("match_room", room);

    io.to(room).emit(
      "receive_message",
      `You have been paired! Start chatting.`
    );
    console.log(`Paired users in ${room}`);
  }
}

function removeFromQueue(socket) {
  queue = queue.filter((user) => user.id !== socket.id);
  console.log("User removed from queue:", socket.id);
}

function removeFromRooms(socket) {
  const room = rooms[socket.id];
  if (room) {
    io.to(room).emit(
      "receive_message",
      "Your chat partner left. Searching for a new match..."
    );
    const otherUser = Object.keys(rooms).find(
      (id) => rooms[id] === room && id !== socket.id
    );

    if (otherUser) {
      queue.push(io.sockets.sockets.get(otherUser)); // Put the remaining user back in queue
      delete rooms[otherUser]; // Remove the other user from the rooms object
    }

    delete rooms[socket.id];
    io.socketsLeave(room); // Ensure all users leave the room
  }
}

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
