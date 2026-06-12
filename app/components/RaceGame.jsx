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
          <h1>Carrera en curso</h1>
          <p>Responde preguntas para avanzar hasta la meta.</p>
        </div>

        <div className="race-length">
          Meta: {lobby.raceLength} casillas
        </div>
      </header>

      <section className="race-board">
        {lobby.players.map((player) => {
          const progress = Math.min(
            100,
            (player.position / lobby.raceLength) * 100
          );

          return (
            <div className="track-wrapper" key={player.id}>
              <div className="track-info">
                <strong>{player.name}</strong>
                <span>
                  {player.position} / {lobby.raceLength}
                </span>
              </div>

              <div className="track">
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

      <section className="card question-card">
        {lobby.status === "finished" ? (
          <>
            <h2>Partida finalizada</h2>
            {message && <p className="message">{message}</p>}
          </>
        ) : (
          <>
            <h2>Tu pregunta</h2>

            <p className="question">{currentQuestion.question}</p>

            <div className="answers">
              {currentQuestion.options.map((option, index) => (
                <button key={index} onClick={() => submitAnswer(index)}>
                  {option}
                </button>
              ))}
            </div>

            <div className="player-stats">
              <span>Posición: {currentPlayer.position}</span>
              <span>Racha: {currentPlayer.streak}</span>
            </div>

            {message && <p className="message">{message}</p>}
          </>
        )}
      </section>
    </main>
  );
}