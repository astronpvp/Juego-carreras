import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(window.location.origin, {
      path: "/socket.io",
      transports: ["websocket"],  // evita el polling que falla con Next.js dev
    });
  }
  return socket;
}