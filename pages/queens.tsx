import { useMemo, useState } from "react";
import styles from "../styles/Queens.module.css";

const BOARD_SIZE = 8;
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;
const REGION_MAP = [
  0, 0, 1, 1, 2, 2, 2, 3,
  0, 0, 1, 1, 2, 3, 2, 3,
  0, 1, 1, 1, 2, 3, 3, 3,
  0, 0, 0, 1, 2, 2, 3, 3,
  4, 4, 4, 5, 6, 6, 7, 7,
  4, 5, 4, 5, 6, 7, 7, 7,
  4, 5, 5, 5, 6, 6, 6, 7,
  4, 4, 5, 5, 6, 6, 7, 7,
];
const REGION_COLORS = [
  "#7b3fa1", // Purple
  "#d84242", // Red
  "#2f6ed6", // Blue
  "#f28a2b", // Orange
  "#f5d847", // Yellow
  "#3ea65b", // Green
  "#8a5a3b", // Brown
  "#d4d7dd", // Light Grey
];
const REGION_TEXT = [
  "#f8f3ff",
  "#fff4f4",
  "#eef5ff",
  "#2a1c11",
  "#2a1c11",
  "#f4fff7",
  "#f7efe8",
  "#2a1c11",
];

function getRow(index: number) {
  return Math.floor(index / BOARD_SIZE);
}

function getCol(index: number) {
  return index % BOARD_SIZE;
}

export default function Queens() {
  const [board, setBoard] = useState<boolean[]>(
    Array(TOTAL_CELLS).fill(false),
  );

  const queenCount = board.reduce((sum, cell) => sum + (cell ? 1 : 0), 0);

  const {
    conflictSet,
    rowsWithOne,
    colsWithOne,
    regionsWithOne,
  } = useMemo(() => {
    const rows: number[][] = Array.from({ length: BOARD_SIZE }, () => []);
    const cols: number[][] = Array.from({ length: BOARD_SIZE }, () => []);
    const regions: number[][] = Array.from({ length: BOARD_SIZE }, () => []);
    const positions: number[] = [];
    const positionSet = new Set<number>();

    board.forEach((hasQueen, index) => {
      if (!hasQueen) return;
      const row = getRow(index);
      const col = getCol(index);
      const region = REGION_MAP[index];

      rows[row].push(index);
      cols[col].push(index);
      regions[region].push(index);
      positions.push(index);
      positionSet.add(index);
    });

    const conflicts = new Set<number>();
    const markConflicts = (group: number[]) => {
      if (group.length > 1) {
        group.forEach((pos) => conflicts.add(pos));
      }
    };

    rows.forEach(markConflicts);
    cols.forEach(markConflicts);
    regions.forEach(markConflicts);

    positions.forEach((index) => {
      const row = getRow(index);
      const col = getCol(index);
      const diagonals = [
        [row - 1, col - 1],
        [row - 1, col + 1],
        [row + 1, col - 1],
        [row + 1, col + 1],
      ];

      diagonals.forEach(([r, c]) => {
        if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return;
        const neighborIndex = r * BOARD_SIZE + c;
        if (positionSet.has(neighborIndex)) {
          conflicts.add(index);
          conflicts.add(neighborIndex);
        }
      });
    });

    return {
      conflictSet: conflicts,
      rowsWithOne: rows.filter((row) => row.length === 1).length,
      colsWithOne: cols.filter((col) => col.length === 1).length,
      regionsWithOne: regions.filter((region) => region.length === 1).length,
    };
  }, [board]);

  const isSolved =
    queenCount === BOARD_SIZE &&
    rowsWithOne === BOARD_SIZE &&
    colsWithOne === BOARD_SIZE &&
    regionsWithOne === BOARD_SIZE &&
    conflictSet.size === 0;

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
          Place 8 queens so each row, column, and region has exactly one.
        </p>
      </header>

      <section className={styles.statusPanel} aria-live="polite">
        <div className={styles.statusItem}>
          Queens placed: <strong>{queenCount}</strong> / {BOARD_SIZE}
        </div>
        <div className={styles.statusItem}>
          Rows complete: <strong>{rowsWithOne}</strong> / {BOARD_SIZE}
        </div>
        <div className={styles.statusItem}>
          Columns complete: <strong>{colsWithOne}</strong> / {BOARD_SIZE}
        </div>
        <div className={styles.statusItem}>
          Regions complete: <strong>{regionsWithOne}</strong> / {BOARD_SIZE}
        </div>
        <div className={styles.statusItem}>
          Conflicting queens: <strong>{conflictSet.size}</strong>
        </div>
        <div className={styles.statusItem}>
          {isSolved
            ? "Puzzle solved!"
            : "Queens cannot touch diagonally."}
        </div>
      </section>

      <section className={styles.rules} aria-label="Rules">
        <h2 className={styles.rulesTitle}>Rules</h2>
        <p className={styles.rulesText}>
          Place one queen in each row, column, and colored region. Queens may
          share long diagonals, but cannot touch diagonally.
        </p>
      </section>

      <section className={styles.board} aria-label="Queens board">
        {board.map((hasQueen, index) => {
          const row = getRow(index);
          const col = getCol(index);
          const region = REGION_MAP[index];
          const isConflict = conflictSet.has(index);

          return (
            <button
              key={index}
              type="button"
              className={`${styles.cell} ${isConflict ? styles.conflict : ""}`}
              onClick={() => toggleQueen(index)}
              aria-pressed={hasQueen}
              aria-label={`Row ${row + 1}, Column ${col + 1}, Region ${
                region + 1
              }`}
              disabled={!hasQueen && queenCount >= BOARD_SIZE}
              style={{
                backgroundColor: REGION_COLORS[region],
                color: REGION_TEXT[region],
              }}
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
