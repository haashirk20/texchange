import { Server } from "socket.io";

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      // Handle random pairing
      socket.on("find_partner", () => {
        const waitingUser = [...io.sockets.sockets.values()].find(
          (s) => s.id !== socket.id && !s.partner
        );

        if (waitingUser) {
          // Match users
          socket.partner = waitingUser.id;
          waitingUser.partner = socket.id;

          socket.emit("partner_found", { partner: waitingUser.id });
          waitingUser.emit("partner_found", { partner: socket.id });
        } else {
          socket.emit("waiting_for_partner");
        }
      });

      // Handle messaging
      socket.on("message", (data) => {
        if (socket.partner) {
          io.to(socket.partner).emit("message", data);
        }
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        if (socket.partner) {
          io.to(socket.partner).emit("partner_disconnected");
        }
      });
    });
  }
  res.end();
};

export default ioHandler;