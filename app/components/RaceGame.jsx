"use client";

export default function RaceGame({
  socket,
  lobby,
  playerId,
  message,
  setMessage,
}) {
  const currentPlayer = lobby.players.find((player) => player.id === playerId);

  if (!currentPlayer) {
    return (
      <main className="screen">
        <section className="card">
          <h1>Jugador no encontrado</h1>
          <p>No se ha podido identificar al jugador actual.</p>
        </section>
      </main>
    );
  }

  const currentQuestion = currentPlayer.currentQuestion;
  const sortedPlayers = [...lobby.players].sort((a, b) => b.position - a.position);
  const leader = sortedPlayers[0];
  const messageType = message.includes("Correcto")
    ? "success"
    : message.includes("Incorrecto")
      ? "danger"
      : "";

  function submitAnswer(answerIndex) {
    setMessage("");

    socket.emit(
      "submitAnswer",
      {
        lobbyId: lobby.id,
        questionId: currentQuestion.id,
        answerIndex,
      },
      (response) => {
        console.log("RESPUESTA SUBMIT ANSWER:", response);

        if (!response.ok) {
          setMessage(response.message);
          return;
        }

        if (response.result.isCorrect) {
          setMessage(`Correcto. Avanzas ${response.result.movement} casilla(s).`);
        } else {
          setMessage("Incorrecto. Retrocedes 1 casilla.");
        }
      }
    );
  }

  return (
    <main className="game-screen">
      <header className="game-header">
        <div>
          <span className="mini-title">Partida #{lobby.id}</span>
          <h1>Carrera en curso</h1>
          <p>Responde rápido, mantén la racha y cruza la meta antes que nadie.</p>
        </div>

        <div className="race-summary">
          <div>
            <span>Meta</span>
            <strong>{lobby.raceLength}</strong>
          </div>
          <div>
            <span>Líder</span>
            <strong>{leader?.name}</strong>
          </div>
          <div>
            <span>Tu racha</span>
            <strong>{currentPlayer.streak}</strong>
          </div>
        </div>
      </header>

      <section className="race-layout">
        <section className="race-board">
          <div className="section-title">
            <h2>Circuito</h2>
            <span>{lobby.players.length} pilotos en pista</span>
          </div>

          {lobby.players.map((player, index) => {
            const progress = Math.min(
              100,
              (player.position / lobby.raceLength) * 100
            );

            return (
              <div
                className={`track-wrapper ${player.id === playerId ? "current" : ""}`}
                key={player.id}
              >
                <div className="track-info">
                  <div>
                    <strong>{player.name}</strong>
                    <span>{player.id === playerId ? "Tu coche" : `Rival ${index + 1}`}</span>
                  </div>
                  <b>
                    {player.position} / {lobby.raceLength}
                  </b>
                </div>

                <div className="track">
                  <div className="track-fill" style={{ width: `${progress}%` }} />
                  <div
                    className="car"
                    style={{
                      left: `calc(${progress}% - 20px)`,
                    }}
                  >
                    🏎️
                  </div>

                  <div className="finish-line">🏁</div>
                </div>
              </div>
            );
          })}
        </section>

        <aside className="leaderboard card compact-card">
          <div className="section-title">
            <h2>Ranking</h2>
            <span>Live</span>
          </div>

          {sortedPlayers.map((player, index) => (
            <div
              className={`rank-row ${player.id === playerId ? "current" : ""}`}
              key={player.id}
            >
              <span className="rank-position">#{index + 1}</span>
              <strong>{player.name}</strong>
              <small>{player.position} casillas</small>
            </div>
          ))}
        </aside>
      </section>

      <section className="card question-card">
        {lobby.status === "finished" ? (
          <div className="finish-card-content">
            <div className="winner-icon">🏆</div>
            <span className="mini-title">Meta cruzada</span>
            <h2>Partida finalizada</h2>
            {message && <p className="message success">{message}</p>}
          </div>
        ) : (
          <>
            <div className="question-header">
              <div>
                <span className="mini-title">Pregunta actual</span>
                <h2>Tu turno</h2>
              </div>
              <div className="streak-chip">🔥 Racha {currentPlayer.streak}</div>
            </div>

            <p className="question">{currentQuestion.question}</p>

            <div className="answers">
              {currentQuestion.options.map((option, index) => (
                <button key={index} onClick={() => submitAnswer(index)} type="button">
                  <span>{String.fromCharCode(65 + index)}</span>
                  {option}
                </button>
              ))}
            </div>

            <div className="player-stats">
              <span>📍 Posición: {currentPlayer.position}</span>
              <span>🏁 Meta: {lobby.raceLength}</span>
              <span>🔥 Racha: {currentPlayer.streak}</span>
            </div>

            {message && <p className={`message ${messageType}`}>{message}</p>}
          </>
        )}
      </section>
    </main>
  );
}
