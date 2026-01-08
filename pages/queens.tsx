import { useMemo, useState } from "react";
import styles from "../styles/Queens.module.css";

const BOARD_SIZE = 8;
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;

function getRow(index: number) {
  return Math.floor(index / BOARD_SIZE);
}

function getCol(index: number) {
  return index % BOARD_SIZE;
}

function areConflicting(a: number, b: number) {
  const rowA = getRow(a);
  const colA = getCol(a);
  const rowB = getRow(b);
  const colB = getCol(b);

  const sameRow = rowA === rowB;
  const sameCol = colA === colB;
  const sameDiag = Math.abs(rowA - rowB) === Math.abs(colA - colB);

  return sameRow || sameCol || sameDiag;
}

export default function Queens() {
  const [board, setBoard] = useState<boolean[]>(
    Array(TOTAL_CELLS).fill(false),
  );

  const queenCount = board.reduce((sum, cell) => sum + (cell ? 1 : 0), 0);

  const { conflictSet, conflictPairs } = useMemo(() => {
    const positions: number[] = [];
    board.forEach((hasQueen, index) => {
      if (hasQueen) positions.push(index);
    });

    const conflicts = new Set<number>();
    let pairs = 0;
    for (let i = 0; i < positions.length; i += 1) {
      for (let j = i + 1; j < positions.length; j += 1) {
        if (areConflicting(positions[i], positions[j])) {
          conflicts.add(positions[i]);
          conflicts.add(positions[j]);
          pairs += 1;
        }
      }
    }

    return { conflictSet: conflicts, conflictPairs: pairs };
  }, [board]);

  const isSolved = queenCount === BOARD_SIZE && conflictSet.size === 0;

  function toggleQueen(index: number) {
    setBoard((prev) => {
      const currentCount = prev.reduce((sum, cell) => sum + (cell ? 1 : 0), 0);
      const next = [...prev];
      if (next[index]) {
        next[index] = false;
        return next;
      }

      if (currentCount >= BOARD_SIZE) {
        return prev;
      }

      next[index] = true;
      return next;
    });
  }

  function resetBoard() {
    setBoard(Array(TOTAL_CELLS).fill(false));
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Queens</h1>
        <p className={styles.subtitle}>
          Place 8 queens so none share a row, column, or diagonal.
        </p>
      </header>

      <section className={styles.statusPanel} aria-live="polite">
        <div className={styles.statusItem}>
          Queens placed: <strong>{queenCount}</strong> / {BOARD_SIZE}
        </div>
        <div className={styles.statusItem}>
          Conflicts: <strong>{conflictPairs}</strong>
        </div>
        <div className={styles.statusItem}>
          {isSolved ? "Puzzle solved!" : "Keep going."}
        </div>
      </section>

      <section className={styles.board} aria-label="Queens board">
        {board.map((hasQueen, index) => {
          const row = getRow(index);
          const col = getCol(index);
          const isDark = (row + col) % 2 === 1;
          const isConflict = conflictSet.has(index);

          return (
            <button
              key={index}
              type="button"
              className={`${styles.cell} ${isDark ? styles.dark : styles.light} ${
                isConflict ? styles.conflict : ""
              }`}
              onClick={() => toggleQueen(index)}
              aria-pressed={hasQueen}
              aria-label={`Row ${row + 1}, Column ${col + 1}`}
            >
              {hasQueen ? "Q" : ""}
            </button>
          );
        })}
      </section>

      <section className={styles.controls}>
        <button className={styles.button} type="button" onClick={resetBoard}>
          Clear board
        </button>
      </section>
    </main>
  );
}
