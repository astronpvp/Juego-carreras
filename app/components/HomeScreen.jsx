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

  const isCreateMode = mode === "create";

  return (
    <main className="screen home-screen">
      <section className="landing-shell">
        <div className="hero-panel">
          <div className="eyebrow">
            <span className="status-dot" /> Online multiplayer
          </div>

          <h1>
            Carrera <span>Trivial</span>
          </h1>

          <p className="subtitle hero-copy">
            Crea una sala privada, reta a tus amigos y gana posiciones
            respondiendo preguntas antes de que el resto llegue a meta.
          </p>

          <div className="feature-grid">
            <article>
              <strong>🏎️ Sprint mental</strong>
              <span>Acierta para avanzar casillas en tiempo real.</span>
            </article>
            <article>
              <strong>🔥 Rachas x3</strong>
              <span>Cada tercera respuesta correcta impulsa tu coche.</span>
            </article>
            <article>
              <strong>🏁 Hasta 4 pilotos</strong>
              <span>Lobby con código, contraseña y estado de preparado.</span>
            </article>
          </div>
        </div>

        <section className="card form-card">
          <div className="card-header">
            <span className="mini-title">Acceso a partida</span>
            <h2>{isCreateMode ? "Crear lobby" : "Unirse a lobby"}</h2>
            <p>
              {isCreateMode
                ? "Configura tu sala y comparte el código con tus amigos."
                : "Introduce el código recibido para entrar en la carrera."}
            </p>
          </div>

          <div className="tabs" role="tablist" aria-label="Modo de acceso">
            <button
              className={isCreateMode ? "active" : ""}
              onClick={() => setMode("create")}
              type="button"
            >
              Crear
            </button>

            <button
              className={!isCreateMode ? "active" : ""}
              onClick={() => setMode("join")}
              type="button"
            >
              Unirse
            </button>
          </div>

          <div className="field-group">
            <label>Nombre de jugador</label>
            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Ej: Alex"
              autoComplete="nickname"
            />
          </div>

          {!isCreateMode && (
            <div className="field-group">
              <label>Código de lobby</label>
              <input
                value={lobbyId}
                onChange={(e) => setLobbyId(e.target.value)}
                placeholder="Ej: A1B2C3"
                autoCapitalize="characters"
              />
            </div>
          )}

          <div className="field-group">
            <label>Contraseña</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña de la lobby"
              type="password"
              autoComplete="current-password"
            />
          </div>

          {message && <p className="error">⚠️ {message}</p>}

          {isCreateMode ? (
            <button className="primary cta" onClick={createLobby} type="button">
              Crear lobby <span>→</span>
            </button>
          ) : (
            <button className="primary cta" onClick={joinLobby} type="button">
              Entrar en carrera <span>→</span>
            </button>
          )}
        </section>
      </section>
    </main>
  );
}
