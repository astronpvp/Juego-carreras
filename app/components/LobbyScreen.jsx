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
    <main className="screen">
      <section className="card wide">
        <h1>Lobby</h1>

        <div className="lobby-code">
          Código de lobby:
          <strong>{lobby.id}</strong>
        </div>

        <p className="subtitle">
          Comparte este código y la contraseña con los jugadores.
        </p>

        <div className="info-grid">
          <div>
            <span>Estado</span>
            <strong>
              {lobby.status === "waiting"
                ? "Esperando jugadores"
                : "Jugando"}
            </strong>
          </div>

          <div>
            <span>Longitud carrera</span>
            <strong>{lobby.raceLength} casillas</strong>
          </div>

          <div>
            <span>Jugadores</span>
            <strong>{lobby.players.length} / 4</strong>
          </div>
        </div>

        <h2>Participantes</h2>

        <div className="players-list">
          {lobby.players.map((player) => (
            <div className="player-row" key={player.id}>
              <div>
                <strong>{player.name}</strong>
                {player.isAdmin && <span className="badge">Admin</span>}
              </div>

              <span className={player.ready ? "ready" : "not-ready"}>
                {player.ready ? "Listo" : "No listo"}
              </span>
            </div>
          ))}
        </div>

        {message && <p className="error">{message}</p>}

        <button className="primary" onClick={toggleReady}>
          {currentPlayer?.ready ? "Quitar listo" : "Estoy listo"}
        </button>

        {lobby.players.length < 2 && (
          <p className="warning">
            Hace falta mínimo 2 jugadores para empezar.
          </p>
        )}

        {lobby.players.length >= 2 && (
          <p className="subtitle">
            Cuando todos estén listos, la carrera empezará automáticamente.
          </p>
        )}
      </section>
    </main>
  );
}