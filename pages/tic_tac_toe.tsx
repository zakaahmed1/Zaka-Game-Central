import { useState } from "react";
import styles from "../styles/TicTacToe.module.css";

type Player = "X" | "O" | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | "Draw" | null>(null);

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function handleClick(index: number) {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else if (newBoard.every((cell) => cell !== null)) {
      setWinner("Draw");
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  }

  function checkWinner(b: Player[]) {
    for (let combo of winningCombinations) {
      const [a, c, d] = combo;
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        return b[a];
      }
    }
    return null;
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Tic Tac Toe</h1>

      {!winner && (
        <div className={styles.turn}>Current Turn: {currentPlayer}</div>
      )}

      <div className={styles.board}>
        {board.map((cell, index) => (
          <div
            key={index}
            className={`${styles.cell} ${
              cell === "X" ? styles.x : cell === "O" ? styles.o : ""
            }`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>

      {winner && (
        <div className={styles.result}>
          {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
          <button className={styles.button} onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
    </main>
  );
}
