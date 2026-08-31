import { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { SocketRoom, SocketEvents } from "../types/socket.type.js";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: { origin: process.env.FRONTEND, credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("client connected", socket.id);

    socket.on(SocketEvents.joinStaff, () => {
      socket.join(SocketRoom.staff);
    });

    socket.on("disconnect", () => {
      console.log("client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("socket.io not initialized");
  return io;
};

//   getIO().to("staff").emit("new_order", order);
