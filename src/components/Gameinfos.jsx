import React, { useState } from "react";

function Gameinfos({ room, socket, resetGame }) {
  const [showRules, setShowRules] = useState(false);

  if (!room || !socket) return null;

  const isCreator = room.creatorId === socket.id;

  const toggleRules = () => setShowRules(!showRules);

  return (
    <div className="gameinfos-container">
      {isCreator && (
        <button className="restart-button" onClick={() => resetGame(room.roomId)}>
          🔁 თამაში რესტარტი
        </button>
      )}

      <button className="rules-button" onClick={toggleRules}>
        📜 წესები
      </button>

      {showRules && (
        <div className="rules-modal">
          <div className="rules-content">
            <button className="close-button" onClick={toggleRules}>×</button>
            <h2>თამაშის წესები</h2>
            <p>
              🔹 თამაში არის ორ გუნდს შორის: წითლები და ლურჯები.<br />
              🔹 თითოეულ გუნდს ჰყავს ერთი Spymaster და ერთი ან მეტი Operative.<br />
              🔹 Spymaster ხედავს სიტყვების ფერებს და იძლევა ასოციაციურ მინიშნებას (სიტყვა + რიცხვი).<br />
              🔹 Operative კი ცდილობს გამოიცნოს შესაბამისი სიტყვები თავისი გუნდის ფერის.<br />
              🔹 თუ გუნდის ოპერატივი არასწორად გამოიცნობს სხვა გუნდის სიტყვას – გადადის სვლა.<br />
              🔹 თუ გამოიცნობს ასასინს (შავი) – თამაშში წააგებს.<br />
              🔹 ის გუნდი იგებს, ვინც პირველი გამოიცნობს ყველა საკუთარ სიტყვას.
            </p>
            <button className="close-button-bottom" onClick={toggleRules}>დახურვა</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gameinfos;
