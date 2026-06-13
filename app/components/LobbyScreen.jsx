"use client";

export default function LobbyScreen({
  socket,
  lobby,
  playerId,
  setLobby,
  setMessage,
  message,
}) {
  const currentPlayer = lobby.players.find((player) => player.id === playerId);
  const readyPlayers = lobby.players.filter((player) => player.ready).length;
  const canStart = lobby.players.length >= 2;

  function toggleReady() {
    setMessage("");

    socket.emit(
      "setReady",
      {
        lobbyId: lobby.id,
        ready: !currentPlayer.ready,
      },
      (response) => {
        console.log("RESPUESTA SET READY:", response);

        if (!response.ok) {
          setMessage(response.message);
          return;
        }

        setLobby({ ...response.lobby });
      }
    );
  }

  return (
    <main className="screen lobby-screen">
      <section className="card wide lobby-card">
        <div className="lobby-topbar">
          <div>
            <span className="mini-title">Sala privada</span>
            <h1>Lobby de carrera</h1>
            <p className="subtitle">
              Comparte el código y marca tu estado cuando estés preparado.
            </p>
          </div>

          <div className="lobby-code" title="Código de lobby">
            <span>Código</span>
            <strong>{lobby.id}</strong>
          </div>
        </div>

        <div className="info-grid">
          <div>
            <span>Estado</span>
            <strong>
              {lobby.status === "waiting" ? "Esperando" : "Jugando"}
            </strong>
          </div>

          <div>
            <span>Meta</span>
            <strong>{lobby.raceLength} casillas</strong>
          </div>

          <div>
            <span>Preparados</span>
            <strong>
              {readyPlayers} / {lobby.players.length}
            </strong>
          </div>
        </div>

        <div className="lobby-progress" aria-label="Jugadores preparados">
          <span style={{ width: `${(readyPlayers / Math.max(lobby.players.length, 1)) * 100}%` }} />
        </div>

        <div className="section-title">
          <h2>Parrilla de salida</h2>
          <span>{lobby.players.length} / 4 pilotos</span>
        </div>

        <div className="players-list">
          {lobby.players.map((player, index) => (
            <div
              className={`player-row ${player.id === playerId ? "current" : ""}`}
              key={player.id}
            >
              <div className="player-meta">
                <span className="avatar">{index + 1}</span>
                <div>
                  <strong>{player.name}</strong>
                  <small>
                    {player.id === playerId ? "Tú" : "Rival"}
                    {player.isAdmin && " · Admin"}
                  </small>
                </div>
              </div>

              <span className={`pill ${player.ready ? "ready" : "not-ready"}`}>
                {player.ready ? "Listo" : "Pendiente"}
              </span>
            </div>
          ))}
        </div>

        {message && <p className="error">⚠️ {message}</p>}

        <button className="primary cta" onClick={toggleReady} type="button">
          {currentPlayer?.ready ? "Quitar preparado" : "Estoy preparado"}
          <span>{currentPlayer?.ready ? "↺" : "✓"}</span>
        </button>

        {!canStart && (
          <p className="warning">
            ⚡ Hace falta mínimo 2 jugadores para que empiece la carrera.
          </p>
        )}

        {canStart && (
          <p className="subtitle center-text">
            La partida arrancará automáticamente cuando todos estén listos.
          </p>
        )}
      </section>
    </main>
  );
}
