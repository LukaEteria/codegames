import { useEffect, useState } from "react";
import io from "socket.io-client";

import Lobby from "./components/Lobby";
import Game from "./components/Game";

const socket = io("http://localhost:3001");

function App() {
  const [nickname, setNickname] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [room, setRoom] = useState(null);

  // 🧠 Room data handling
  useEffect(() => {
    socket.on("room-data", (data) => {
      console.log("📦 Received room data:", data);
      setRoom(data);
    });
    return () => socket.off("room-data"); // Cleanup on component unmount
  }, []);

  // 🔁 Attempt to rejoin the room on page refresh
  useEffect(() => {
    const savedRoomId = localStorage.getItem("roomId");
    const savedNickname = localStorage.getItem("nickname");

    if (savedRoomId && savedNickname) {
      console.log("🔄 Attempting to rejoin room:", savedRoomId, savedNickname);
      socket.emit("rejoin-room", { roomId: savedRoomId, nickname: savedNickname }, (err) => {
        if (err) {
          console.warn("❌ Failed to rejoin room:", err);
          localStorage.removeItem("roomId");
          localStorage.removeItem("nickname");
          setRoomId(null);
          setNickname("");
        } else {
          setRoomId(savedRoomId);
          setNickname(savedNickname); // Make sure to keep the nickname intact
        }
      });
    }
  }, []);

  // ✅ Create a new room
  const handleCreate = () => {
    if (!nickname.trim()) return alert("Please enter a nickname.");
    socket.emit("create-room", { nickname }, (id) => {
      setRoomId(id);
      localStorage.setItem("roomId", id);
      localStorage.setItem("nickname", nickname);
      console.log("✅ Room created:", id);
    });
  };

  // ✅ Join an existing room
  const handleJoin = () => {
    const id = prompt("Enter room ID");
    if (!nickname.trim()) return alert("Please enter a nickname.");
    socket.emit("join-room", { roomId: id, nickname }, (err) => {
      if (err) return alert(err);
      setRoomId(id);
      localStorage.setItem("roomId", id);
      localStorage.setItem("nickname", nickname);
      console.log("✅ Successfully joined room:", id);
    });
  };

  // Prevent rendering Lobby if we have room data and nickname
  if (!roomId || !room || !nickname) {
    return (
      <Lobby
        nickname={nickname}
        setNickname={setNickname}
        handleCreate={handleCreate}
        handleJoin={handleJoin}
      />
    );
  }

  // Once the user is in a room, render the Game component
  return (
    <Game
      socket={socket}
      room={room}
      roomId={roomId}
      nickname={nickname}
      setRoom={setRoom}
    />
  );
}

export default App;
