"use client";

import { useState } from "react";

export default function HomeScreen({
  socket,
  setLobby,
  setPlayerId,
  setMessage,
  message,
}) {
  const [mode, setMode] = useState("create");

  const [playerName, setPlayerName] = useState("");
  const [password, setPassword] = useState("");
  const [lobbyId, setLobbyId] = useState("");

  function createLobby() {
    setMessage("");

    socket.emit(
      "createLobby",
      {
        playerName,
        password,
      },
      (response) => {
        if (!response.ok) {
          setMessage(response.message);
          return;
        }

        setLobby(response.lobby);
        setPlayerId(response.playerId);
      }
    );
  }

  function joinLobby() {
    setMessage("");

    socket.emit(
      "joinLobby",
      {
        lobbyId: lobbyId.toUpperCase(),
        playerName,
        password,
      },
      (response) => {
        if (!response.ok) {
          setMessage(response.message);
          return;
        }

        setLobby(response.lobby);
        setPlayerId(response.playerId);
      }
    );
  }

  return (
    <main className="screen">
      <section className="card">
        <h1>Carrera Trivial</h1>

        <p className="subtitle">
          Crea una lobby online, comparte el código y compite respondiendo
          preguntas.
        </p>

        <div className="tabs">
          <button
            className={mode === "create" ? "active" : ""}
            onClick={() => setMode("create")}
          >
            Crear lobby
          </button>

          <button
            className={mode === "join" ? "active" : ""}
            onClick={() => setMode("join")}
          >
            Unirse
          </button>
        </div>

        <label>Nombre de jugador</label>
        <input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Ej: Alex"
        />

        {mode === "join" && (
          <>
            <label>Código de lobby</label>
            <input
              value={lobbyId}
              onChange={(e) => setLobbyId(e.target.value)}
              placeholder="Ej: A1B2C3"
            />
          </>
        )}

        <label>Contraseña</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña de la lobby"
          type="password"
        />

        {message && <p className="error">{message}</p>}

        {mode === "create" ? (
          <button className="primary" onClick={createLobby}>
            Crear lobby
          </button>
        ) : (
          <button className="primary" onClick={joinLobby}>
            Unirme a lobby
          </button>
        )}
      </section>
    </main>
  );
}