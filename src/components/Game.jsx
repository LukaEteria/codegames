import { useState, useEffect } from "react";
import Board from "./Board";
import "../App.css";
import PlayerDropdown from "./PlayerDropdown";
import Gameinfos from "./Gameinfos";
import PlayerRoleControl from "./PlayerRoleControl";

function Game({ socket, room, nickname, roomId, setRoom }) {
  const me = room.players.find((p) => p.nickname === nickname);
  const [clue, setClue] = useState("");
  const [selectedWords, setSelectedWords] = useState([]);
  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
    const handleRoomData = (updatedRoom) => setRoom(updatedRoom);
    socket.on("room-data", handleRoomData);
    return () => socket.off("room-data", handleRoomData);
  }, [socket, setRoom]);

  const isSpymaster = me.role === "spymaster";
  const isOperative = me.role === "operative";
  const isTurn = me.team === room.turn;
  const myTeam = me.team;
  const isNotInTeam = !me.team;

  const teamHasSpymaster = (team) =>
    room.players.some((p) => p.role === "spymaster" && p.team === team);

  const canReveal =
    isOperative &&
    isTurn &&
    room.clue &&
    room.clueTeam === myTeam &&
    room.guessesLeft > 0 &&
    !room.winner;

  const submitClue = () => {
    if (
      clue &&
      selectedWords.length > 0 &&
      isSpymaster &&
      isTurn &&
      selectedWords.every((word) => {
        const wordObj = room.board.find((w) => w.word === word);
        return wordObj && wordObj.role === myTeam && !wordObj.revealed;
      })
    ) {
      socket.emit("set-clue", {
        roomId,
        clue,
        number: selectedWords.length,
      });
      setClue("");
      setSelectedWords([]);
    } else {
      console.log("❌ მინიშნება არასწორია ან არაა თქვენი გუნდის სვლა");
    }
  };

  const endTurn = () => {
    socket.emit("end-turn", { roomId });
  };

  const chooseRole = (team, role) => {
    socket.emit("set-role", { roomId, team, role });
    localStorage.setItem("team", team);
    localStorage.setItem("role", role);
  };

  const handleSelectWord = (word) => {
    const wordObj = room.board.find((w) => w.word === word);
    if (!wordObj || wordObj.revealed || wordObj.role !== myTeam) return;

    if (!selectedWords.includes(word)) {
      setSelectedWords((prevWords) => [...prevWords, word]);
    } else {
      setSelectedWords((prevWords) => prevWords.filter((w) => w !== word));
    }
  };

  const clueVisibleToOperative =
    room.clue && room.clueTeam === myTeam && isOperative && isTurn;

  const handleGameRestart = () => {
    room.players.forEach((player) => {
      if (player.role !== "spymaster") {
        socket.emit("set-role", { roomId, team: player.team, role: "operative" });
      }
    });

    setIsRestarting(true);
    socket.emit("reset-game", { roomId });
  };

  return (
    <section className="game-board">
      <div className="room-info">
        <div className="player-info">
          <PlayerDropdown room={{ ...room, id: roomId }} />
        </div>
        <div className="game-infos">
          <Gameinfos
            room={room}
            socket={socket}
            roomId={roomId}
            resetGame={handleGameRestart}
          />
          <PlayerRoleControl room={room} socket={socket} />
        </div>
      </div>

      <div className="game-layout">
        {/* 🔵 Blue Panel */}
        <div className="team-panel blue">
          {room.players
            .filter((p) => p.team === "blue")
            .map((p) => (
              <div key={p.id}>
                {p.nickname} ({p.role || "??"})
              </div>
            ))}

          {/* spectator view */}
          {isNotInTeam && (
            <>
              {!teamHasSpymaster("blue") && (
                <button onClick={() => chooseRole("blue", "spymaster")}>
                  სპაიმასტერი
                </button>
              )}
              <button onClick={() => chooseRole("blue", "operative")}>
                ოპერატივი
              </button>
            </>
          )}

          {/* operative in team without spymaster */}
          {me.team === "blue" &&
            me.role !== "spymaster" &&
            !teamHasSpymaster("blue") && (
              <button onClick={() => chooseRole("blue", "spymaster")}>
                გადადით სპაიმასტერში
              </button>
            )}
        </div>

        {/* CENTER */}
        <div className="game-center">
          <p>
            <strong>
              {me.team === "red" ? "🔴" : me.team === "blue" ? "🔵" : "👁"} თქვენ ხართ{" "}
              {isSpymaster ? "სპაიმასტერი" : isOperative ? "ოპერატივი" : "სპექტატორი"}
            </strong>
          </p>

          <Board
            board={room.board}
            isSpymaster={isSpymaster}
            revealWord={(word) => {
              if (canReveal) {
                socket.emit("reveal-word", { roomId, word });
              }
            }}
            selectedWords={isSpymaster && isTurn ? selectedWords : []}
            setSelectedWords={isSpymaster && isTurn ? handleSelectWord : () => {}}
            myTeam={myTeam}
          />

          {room.winner ? (
            <div className="winner">
              🏆 მოიგო {room.winner === "red" ? "🔴 წითელმა" : "🔵 ლურჯმა"} გუნდმა
            </div>
          ) : isSpymaster && isTurn && !room.clue ? (
            <div className="clue-box">
              <input
                placeholder="მინიშნება"
                value={clue}
                onChange={(e) => setClue(e.target.value)}
              />
              <p>აირჩიე გუნდის სიტყვები ({selectedWords.length})</p>
              <button onClick={submitClue}>დადასტურება</button>
            </div>
          ) : isSpymaster && !isTurn ? (
            <div className="turn-box">
              🕵 ახლა თქვენი გუნდის სვლა არ არის — დაელოდეთ მოწინააღმდეგეს.
            </div>
          ) : clueVisibleToOperative ? (
            <div className="turn-box">
              <strong>მინიშნება:</strong> {room.clue.clue} ({room.clue.number})
              <button onClick={endTurn}>ტურის დასრულება</button>
            </div>
          ) : (
            <div className="turn-box">
              {room.turn === "red" ? "🔴 წითელი" : "🔵 ლურჯი"} გუნდის სვლაა...
            </div>
          )}
        </div>

        {/* 🔴 Red Panel */}
        <div className="team-panel red">
          {room.players
            .filter((p) => p.team === "red")
            .map((p) => (
              <div key={p.id}>
                {p.nickname} ({p.role || "??"})
              </div>
            ))}

          {/* spectator view */}
          {isNotInTeam && (
            <>
              {!teamHasSpymaster("red") && (
                <button onClick={() => chooseRole("red", "spymaster")}>
                  სპაიმასტერი
                </button>
              )}
              <button onClick={() => chooseRole("red", "operative")}>
                ოპერატივი
              </button>
            </>
          )}

          {/* operative in team without spymaster */}
          {me.team === "red" &&
            me.role !== "spymaster" &&
            !teamHasSpymaster("red") && (
              <button onClick={() => chooseRole("red", "spymaster")}>
                გადადით სპაიმასტერში
              </button>
            )}
        </div>
      </div>
    </section>
  );
}

export default Game;
