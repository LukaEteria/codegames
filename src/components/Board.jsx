import { motion } from "framer-motion";
import { useMemo } from "react";
import "../App.css";

function Board({ board, isSpymaster, revealWord, selectedWords, setSelectedWords, myTeam }) {
  // შემთხვევითი საწყისი პოზიციები და როტაცია თითოეული ქარდისთვის
  const randomAnimations = useMemo(() => {
    return board.map(() => ({
      x: Math.random() * 200 - 100,       // -100px to +100px მარცხნივ/მარჯვნივ
      y: Math.random() * -200 - 100,      // -100px to -300px ზემოდან ჩამოვარდნა
      rotate: Math.random() * 30 - 15,    // -15° to +15° როტაცია
      delay: Math.random() * 0.5,         // 0 - 0.5 წამამდე შეფერხება
    }));
  }, [board]);

  const handleClick = (cell) => {
    if (cell.revealed) return;

    if (isSpymaster) {
      if (cell.role !== myTeam && !selectedWords.includes(cell.word)) {
        console.log("❌ ეს სიტყვა არ ეკუთვნის სპაიმასტერს:", cell.word);
        return;
      }
      setSelectedWords(cell.word);
    } else {
      revealWord(cell.word);
    }
  };

  return (
    <div className="board">
      {board.map((cell, index) => {
        const row = Math.floor(index / 5); // 5 სვეტი
        const col = index % 5;

        const isSelected = selectedWords.includes(cell.word);
        const showRole = isSpymaster || cell.revealed;

        const classNames = [
          "cell",
          showRole ? `role-${cell.role}` : "",
          cell.revealed ? "revealed" : "",
          isSelected ? "selected" : "",
        ]
          .join(" ")
          .trim();

        const { x, y, rotate, delay } = randomAnimations[index];

        return (
          <motion.div
            key={index}
            className={classNames}
            onClick={() => handleClick(cell)}
            initial={{ x, y, rotate, opacity: 0 }}
            animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay,
            }}
            layout
          >
            <span className="word">{cell.word}</span>
            {showRole && !cell.revealed && isSpymaster && (
              <span className="role-mark">({cell.role})</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default Board;
