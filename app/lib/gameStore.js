const { getRandomQuestion, questions } = require("./questions");

const lobbies = {};

function generateLobbyId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateRaceLength() {
  return Math.floor(Math.random() * (50 - 25 + 1)) + 25;
}

function cleanQuestion(question) {
  return {
    id: question.id,
    question: question.question,
    options: question.options,
  };
}

function getNextQuestion() {
  return cleanQuestion(getRandomQuestion());
}

function createLobby({ adminSocketId, playerName, password }) {
  if (!playerName || !password) {
    throw new Error("Falta el nombre o la contraseña.");
  }

  const lobbyId = generateLobbyId();

  const lobby = {
    id: lobbyId,
    password,
    adminId: adminSocketId,
    status: "waiting",
    raceLength: generateRaceLength(),
    players: [
      {
        id: adminSocketId,
        name: playerName,
        isAdmin: true,
        ready: false,
        position: 0,
        streak: 0,
        currentQuestion: getNextQuestion(),
      },
    ],
  };

  lobbies[lobbyId] = lobby;

  return publicLobby(lobby);
}

function joinLobby({ socketId, lobbyId, playerName, password }) {
  const lobby = lobbies[lobbyId];

  if (!lobby) {
    throw new Error("La lobby no existe.");
  }

  if (lobby.password !== password) {
    throw new Error("Contraseña incorrecta.");
  }

  if (lobby.status !== "waiting") {
    throw new Error("La partida ya ha empezado.");
  }

  if (lobby.players.length >= 4) {
    throw new Error("La lobby está llena.");
  }

  const alreadyInside = lobby.players.some((player) => player.id === socketId);

  if (!alreadyInside) {
    lobby.players.push({
      id: socketId,
      name: playerName,
      isAdmin: false,
      ready: false,
      position: 0,
      streak: 0,
      currentQuestion: getNextQuestion(),
    });
  }

  return publicLobby(lobby);
}

function setPlayerReady({ lobbyId, socketId, ready }) {
  const lobby = lobbies[lobbyId];

  if (!lobby) {
    throw new Error("La lobby no existe.");
  }

  const player = lobby.players.find((p) => p.id === socketId);

  if (!player) {
    throw new Error("Jugador no encontrado.");
  }

  player.ready = Boolean(ready);

  const minPlayers = lobby.players.length >= 2;
  const everyoneReady = lobby.players.every((p) => p.ready === true);

  console.log("=== CHECK READY ===");
  console.log("Lobby:", lobby.id);
  console.log("Jugadores:", lobby.players.length);
  console.log("Mínimo jugadores:", minPlayers);
  console.log("Todos listos:", everyoneReady);
  console.log(
    lobby.players.map((p) => ({
      name: p.name,
      ready: p.ready,
    }))
  );

  if (minPlayers && everyoneReady) {
    console.log("EMPIEZA LA PARTIDA");

    lobby.status = "playing";

    lobby.players.forEach((p) => {
      p.position = 0;
      p.streak = 0;
      p.currentQuestion = getNextQuestion();
    });
  }

  return publicLobby(lobby);
}

function submitAnswer({ lobbyId, socketId, questionId, answerIndex }) {
  const lobby = lobbies[lobbyId];

  if (!lobby) {
    throw new Error("La lobby no existe.");
  }

  if (lobby.status !== "playing") {
    throw new Error("La partida no está en curso.");
  }

  const player = lobby.players.find((p) => p.id === socketId);

  if (!player) {
    throw new Error("Jugador no encontrado.");
  }

  if (!player.currentQuestion || player.currentQuestion.id !== questionId) {
    throw new Error("Pregunta no válida.");
  }

  const fullQuestion = questions.find((q) => q.id === questionId);

  if (!fullQuestion) {
    throw new Error("Pregunta no encontrada.");
  }

  const isCorrect = fullQuestion.correctIndex === answerIndex;

  let movement = 0;

  if (isCorrect) {
    player.streak += 1;

    if (player.streak > 0 && player.streak % 3 === 0) {
      movement = 3;
    } else {
      movement = 1;
    }

    player.position += movement;
  } else {
    player.streak = 0;
    movement = -1;
    player.position -= 1;
  }

  if (player.position < 0) {
    player.position = 0;
  }

  if (player.position >= lobby.raceLength) {
    player.position = lobby.raceLength;
    lobby.status = "finished";

    return {
      lobby: publicLobby(lobby),
      isCorrect,
      movement,
      winner: {
        id: player.id,
        name: player.name,
      },
    };
  }

  player.currentQuestion = getNextQuestion();

  return {
    lobby: publicLobby(lobby),
    isCorrect,
    movement,
    winner: null,
  };
}

function getLobby(lobbyId) {
  const lobby = lobbies[lobbyId];

  if (!lobby) {
    throw new Error("La lobby no existe.");
  }

  return publicLobby(lobby);
}

function removePlayer(socketId) {
  let updatedLobby = null;

  Object.keys(lobbies).forEach((lobbyId) => {
    const lobby = lobbies[lobbyId];
    const playerExists = lobby.players.some((p) => p.id === socketId);

    if (!playerExists) {
      return;
    }

    lobby.players = lobby.players.filter((p) => p.id !== socketId);

    if (lobby.players.length === 0) {
      delete lobbies[lobbyId];
      return;
    }

    if (lobby.adminId === socketId) {
      lobby.adminId = lobby.players[0].id;
      lobby.players[0].isAdmin = true;
    }

    if (lobby.status === "playing" && lobby.players.length < 2) {
      lobby.status = "waiting";
      lobby.players.forEach((p) => {
        p.ready = false;
      });
    }

    updatedLobby = publicLobby(lobby);
  });

  return updatedLobby;
}

function publicLobby(lobby) {
  return {
    id: lobby.id,
    adminId: lobby.adminId,
    status: lobby.status,
    raceLength: lobby.raceLength,
    players: lobby.players.map((player) => ({
      id: player.id,
      name: player.name,
      isAdmin: player.isAdmin,
      ready: player.ready,
      position: player.position,
      streak: player.streak,
      currentQuestion: player.currentQuestion,
    })),
  };
}

module.exports = {
  createLobby,
  joinLobby,
  setPlayerReady,
  submitAnswer,
  getLobby,
  removePlayer,
};