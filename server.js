const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const {
  createLobby,
  joinLobby,
  setPlayerReady,
  submitAnswer,
  getLobby,
  removePlayer,
} = require("./app/lib/gameStore");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    socket.on("createLobby", ({ playerName, password }, callback) => {
      try {
        const lobby = createLobby({
          adminSocketId: socket.id,
          playerName,
          password,
        });

        socket.join(lobby.id);

        callback({
          ok: true,
          lobby,
          playerId: socket.id,
        });

        io.to(lobby.id).emit("lobbyUpdated", lobby);
      } catch (error) {
        callback({ ok: false, message: error.message });
      }
    });

    socket.on("joinLobby", ({ lobbyId, playerName, password }, callback) => {
      try {
        const lobby = joinLobby({
          socketId: socket.id,
          lobbyId,
          playerName,
          password,
        });

        socket.join(lobby.id);

        callback({
          ok: true,
          lobby,
          playerId: socket.id,
        });

        io.to(lobby.id).emit("lobbyUpdated", lobby);
      } catch (error) {
        callback({ ok: false, message: error.message });
      }
    });

    socket.on("setReady", ({ lobbyId, ready }, callback) => {
  try {
    const lobby = setPlayerReady({
      lobbyId,
      socketId: socket.id,
      ready,
    });

    console.log("LOBBY DEVUELTA AL FRONT:", lobby);
    console.log("STATUS DEVUELTO:", lobby.status);

    callback({ ok: true, lobby });

    io.to(lobby.id).emit("lobbyUpdated", lobby);
  } catch (error) {
    callback({ ok: false, message: error.message });
  }
});

    socket.on("submitAnswer", ({ lobbyId, questionId, answerIndex }, callback) => {
      try {
        const result = submitAnswer({
          lobbyId,
          socketId: socket.id,
          questionId,
          answerIndex,
        });

        callback({
          ok: true,
          result,
        });

        io.to(lobbyId).emit("lobbyUpdated", result.lobby);

        if (result.winner) {
          io.to(lobbyId).emit("gameFinished", {
            winner: result.winner,
            lobby: result.lobby,
          });
        }
      } catch (error) {
        callback({ ok: false, message: error.message });
      }
    });

    socket.on("getLobby", ({ lobbyId }, callback) => {
      try {
        const lobby = getLobby(lobbyId);
        callback({ ok: true, lobby });
      } catch (error) {
        callback({ ok: false, message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);

      const lobby = removePlayer(socket.id);

      if (lobby) {
        io.to(lobby.id).emit("lobbyUpdated", lobby);
      }
    });
  });

  const port = process.env.PORT || 3000;

  httpServer.listen(port, "0.0.0.0", () => {
  console.log(`Servidor listo en http://0.0.0.0:${port}`);
});
});