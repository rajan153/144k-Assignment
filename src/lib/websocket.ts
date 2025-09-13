import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: SocketIOServer | null = null;

export function initializeWebSocket(server: HTTPServer) {
  if (io) return io;

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-community", (data) => {
      socket.join("community");
      console.log("User joined community room");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}

export function getWebSocketServer() {
  return io;
}

export function broadcastNewMember(userData: any) {
  if (io) {
    io.to("community").emit("new-member", {
      message: `Welcome ${userData.name} to the 144K community!`,
      user: userData,
      timestamp: new Date(),
    });
  }
}

export function broadcastStatsUpdate(stats: any) {
  if (io) {
    io.to("community").emit("stats-update", stats);
  }
}
