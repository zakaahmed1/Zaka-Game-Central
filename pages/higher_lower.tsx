import { useEffect, useMemo, useState } from "react";
import styles from "../styles/HigherLower.module.css";
import { gameData, type Profile } from "../public/data/game_data";

function pickRandomButNot(max: number, notIndex: number) {
  let idx = Math.floor(Math.random() * max);
  while (idx === notIndex) idx = Math.floor(Math.random() * max);
  return idx;
}

export default function HigherLower() {
  const DATA = gameData;

  const [score, setScore] = useState(0);
  const [aIndex, setAIndex] = useState<number | null>(null);
  const [bIndex, setBIndex] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (DATA.length < 2) return;
    startNewGame();
  }, [DATA.length]);

  function startNewGame() {
    const a0 = Math.floor(Math.random() * DATA.length);
    const b0 = pickRandomButNot(DATA.length, a0);
    setAIndex(a0);
    setBIndex(b0);
    setScore(0);
    setGameOver(false);
  }

  const a: Profile | null = useMemo(
    () => (aIndex === null ? null : DATA[aIndex]),
    [aIndex, DATA]
  );
  const b: Profile | null = useMemo(
    () => (bIndex === null ? null : DATA[bIndex]),
    [bIndex, DATA]
  );

  function nextRound(promoteIndex: number) {
    const newA = promoteIndex;
    const newB = pickRandomButNot(DATA.length, newA);
    setAIndex(newA);
    setBIndex(newB);
  }

  function handleGuess(isHigher: boolean) {
    if (!a || !b || aIndex === null || bIndex === null) return;

    const correct = isHigher
      ? b.follower_count >= a.follower_count
      : b.follower_count < a.follower_count;

    if (correct) {
      setScore((s) => s + 1);
      nextRound(bIndex);
    } else {
      setGameOver(true);
    }
  }

  const bgA = a?.image
    ? { backgroundImage: `url(${a.image})` as const }
    : { backgroundImage: "linear-gradient(135deg,#37474f,#263238)" as const };

  const bgB = b?.image
    ? { backgroundImage: `url(${b.image})` as const }
    : { backgroundImage: "linear-gradient(135deg,#4e342e,#3e2723)" as const };

  if (!a || !b) {
    return (
      <main className={styles.container}>
        <h1 className={styles.title}>Higher or Lower</h1>
        <div className={styles.score}>Score: {score}</div>
        <p style={{ opacity: 0.7 }}>Loading…</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Higher or Lower</h1>
        <div className={styles.score}>Score: {score}</div>
      </header>

      {gameOver ? (
        <div className={styles.gameOverScreen}>
          <h2>Game Over</h2>
          <p>Your score: {score}</p>
          <button className={styles.choice} onClick={startNewGame}>
            Play Again
          </button>
        </div>
      ) : (
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
                  onClick={() => handleGuess(true)}
                >
                  Higher ▲
                </button>
                <button
                  className={`${styles.choice} ${styles.lower}`}
                  onClick={() => handleGuess(false)}
                >
                  Lower ▼
                </button>
              </div>

              <p className={styles.subtext}>followers than {a.name}</p>
              <p className={styles.desc}>
                {b.description} • {b.country}
              </p>
            </div>
          </article>
        </section>
      )}
    </main>
  );
}
