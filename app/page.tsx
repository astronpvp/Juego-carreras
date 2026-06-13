"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/app/lib/socket";
import HomeScreen from "@/app/components/HomeScreen";
import LobbyScreen from "@/app/components/LobbyScreen";
import RaceGame from "@/app/components/RaceGame";

export default function HomePage() {
  const [socket, setSocket] = useState<any>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [lobby, setLobby] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    function handleConnect() {
      setPlayerId(socketInstance.id ?? null);
    }

    function handleLobbyUpdated(updatedLobby: any) {
      console.log("LOBBY ACTUALIZADA EN FRONT:", updatedLobby);
      console.log("STATUS:", updatedLobby.status);

      setLobby({ ...updatedLobby });
    }

    function handleGameFinished({ winner, lobby }: any) {
      setLobby({ ...lobby });
      setMessage(`Ha ganado ${winner.name}`);
    }

    socketInstance.on("connect", handleConnect);
    socketInstance.on("lobbyUpdated", handleLobbyUpdated);
    socketInstance.on("gameFinished", handleGameFinished);

    if (socketInstance.connected) {
      handleConnect();
    }

    return () => {
      socketInstance.off("connect", handleConnect);
      socketInstance.off("lobbyUpdated", handleLobbyUpdated);
      socketInstance.off("gameFinished", handleGameFinished);
    };
  }, []);

  console.log("RENDER PAGE - LOBBY:", lobby);

  if (!socket) {
    return (
      <main className="screen">
        <section className="card">
          <span className="mini-title">Conectando</span>
          <h1>Preparando carrera</h1>
          <p className="subtitle">Estamos conectando con el servidor del juego...</p>
        </section>
      </main>
    );
  }

  if (!lobby) {
    return (
      <HomeScreen
        socket={socket}
        setLobby={setLobby}
        setPlayerId={setPlayerId}
        setMessage={setMessage}
        message={message}
      />
    );
  }

  const status = String(lobby.status).trim();

  console.log("PANTALLA QUE VOY A PINTAR:", status);

  if (status === "playing" || status === "finished") {
    console.log("ENTRO EN RACEGAME");

    return (
      <RaceGame
        socket={socket}
        lobby={lobby}
        playerId={playerId}
        message={message}
        setMessage={setMessage}
      />
    );
  }

  if (status === "waiting") {
    console.log("ENTRO EN LOBBYSCREEN");

    return (
      <LobbyScreen
        socket={socket}
        lobby={lobby}
        playerId={playerId}
        setLobby={setLobby}
        setMessage={setMessage}
        message={message}
      />
    );
  }

  return (
    <main className="screen">
      <section className="card">
        <h1>Estado desconocido</h1>
        <p>{status}</p>
      </section>
    </main>
  );
}