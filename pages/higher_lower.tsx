// pages/higher_lower.tsx
import { useEffect, useMemo, useState } from "react";
import styles from "../styles/HigherLower.module.css";
import { GAME_DATA } from "../public/data/game_data";

type Profile = {
  name: string;
  description: string;
  country: string;
  follower_count: number; // millions
  image?: string;         // optional background image URL (e.g. "/images/ariana.jpg")
};

function pickRandomButNot(poolSize: number, notIndex: number): number {
  let idx = Math.floor(Math.random() * poolSize);
  while (idx === notIndex) idx = Math.floor(Math.random() * poolSize);
  return idx;
}

export default function HigherLower() {
  const DATA: Profile[] = GAME_DATA as Profile[];

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [aIndex, setAIndex] = useState<number | null>(null);
  const [bIndex, setBIndex] = useState<number | null>(null);

  // init two distinct entries
  useEffect(() => {
    if (DATA.length < 2) return;
    const first = Math.floor(Math.random() * DATA.length);
    const second = pickRandomButNot(DATA.length, first);
    setAIndex(first);
    setBIndex(second);
  }, [DATA.length]);

  const a = useMemo(() => (aIndex === null ? null : DATA[aIndex]), [aIndex, DATA]);
  const b = useMemo(() => (bIndex === null ? null : DATA[bIndex]), [bIndex, DATA]);

  function nextRound(keepAIndex: number) {
    const nextB = pickRandomButNot(DATA.length, keepAIndex);
    setAIndex(keepAIndex);
    setBIndex(nextB);
  }

  // choice: "Higher" means B >= A, "Lower" means B < A
  function guessHigher() {
    if (!a || !b || aIndex === null || bIndex === null) return;
    if (b.follower_count >= a.follower_count) {
      setScore((s) => s + 1);
      nextRound(bIndex);
    } else {
      setGameOver(true);
    }
  }

  function guessLower() {
    if (!a || !b || aIndex === null || bIndex === null) return;
    if (b.follower_count < a.follower_count) {
      setScore((s) => s + 1);
      nextRound(bIndex);
    } else {
      setGameOver(true);
    }
  }

  function resetGame() {
    setScore(0);
    setGameOver(false);
    const first = Math.floor(Math.random() * DATA.length);
    const second = pickRandomButNot(DATA.length, first);
    setAIndex(first);
    setBIndex(second);
  }

  // helpers for bg images (fallback gradient if none)
  const bgA =
    a?.image
      ? { backgroundImage: `url(${a.image})` }
      : { backgroundImage: `linear-gradient(120deg, #313a5b, #1c1f2b)` };

  const bgB =
    b?.image
      ? { backgroundImage: `url(${b.image})` }
      : { backgroundImage: `linear-gradient(120deg, #5b3131, #2b1c1c)` };

  if (!a || !b) {
    return (
      <main className={styles.container}>
        <h1 className={styles.title}>Higher or Lower</h1>
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Higher or Lower</h1>
        <div className={styles.score}>Score: {score}</div>
      </header>

      <section className={styles.game}>
        {/* A — LEFT */}
        <article className={`${styles.card} ${styles.left}`} style={bgA}>
          <div className={styles.overlay} />
          <div className={styles.content}>
            <div className={styles.badge}>A</div>

            <h2 className={styles.name}>{a.name}</h2>
            <p className={styles.has}>has</p>
            <div className={styles.value}>{a.follower_count}M</div>
            <p className={styles.subtext}>followers</p>

            <p className={styles.desc}>
              {a.description} • {a.country}
            </p>
          </div>
        </article>

        {/* VS */}
        <div className={styles.vs}>VS</div>

        {/* B — RIGHT */}
        <article className={`${styles.card} ${styles.right}`} style={bgB}>
          <div className={styles.overlay} />
          <div className={styles.content}>
            <div className={styles.badge}>B</div>

            <h2 className={styles.name}>{b.name}</h2>
            <p className={styles.has}>has</p>

            <div className={styles.choices}>
              <button
                className={`${styles.choice} ${styles.higher}`}
                onClick={guessHigher}
                disabled={gameOver}
                aria-label="Guess Higher"
              >
                Higher ▲
              </button>
              <button
                className={`${styles.choice} ${styles.lower}`}
                onClick={guessLower}
                disabled={gameOver}
                aria-label="Guess Lower"
              >
                Lower ▼
              </button>
            </div>

            <p className={styles.subtext}>
              followers than {a.name}
            </p>

            <p className={styles.desc}>
              {b.description} • {b.country}
            </p>
          </div>
        </article>
      </section>

      <div className={styles.scores}>
        <span>High Score: 0</span>
        <span>Score: {score}</span>
      </div>

      {gameOver && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "grid",
            placeItems: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "#101114",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 16,
              padding: "24px 28px",
              color: "#fff",
              textAlign: "center",
              minWidth: 300,
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Game Over</h3>
            <p style={{ marginTop: 0, marginBottom: 16 }}>
              Final score: <b>{score}</b>
            </p>
            <button
              className={`${styles.choice} ${styles.higher}`}
              onClick={resetGame}
            >
              Play again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
