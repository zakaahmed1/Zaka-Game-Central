import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Home.module.css";

type Game = { name: string; path: string; image: string };

export default function Home() {
  const games: Game[] = [
    { name: "Love Score Calculator", path: "/love-score", image: "/images/love_score_logo.png" },
    { name: "Wordle", path: "/wordle", image: "/images/wordle_game_logo.png" },
    { name: "Blackjack", path: "/blackjack", image: "/images/blackjack_logo.png" },
    { name: "Guessing Game", path: "/guessing-game", image: "/images/guessing_game_logo.png" },
    { name: "Where in the World?", path: "/where-in-the-world", image: "/images/world_guess_logo.png" },
    { name: "Flag Battle", path: "/flag-battle", image: "/images/flag_battle_logo.png" },
    { name: "Higher or Lower", path: "/higher_lower", image: "/images/higher_lower_logo.png" },
    { name: "Tic Tac Toe", path: "/tic_tac_toe", image: "/images/tic_tac_toe_logo.png" },
  ];

  return (
    <>
      {/* Remove body margin just for this page */}
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>

      <main className={styles.containerNoBorder}>
        <h1 className={styles.title}>Zaka&apos;s Game Hub</h1>

        <section className={styles.grid} aria-label="Games">
          {games.map((game) => (
            <Link href={game.path} key={game.name} className={styles.card}>
              <div className={styles.cardInner}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.image}
                    priority={game.name === "Blackjack"}
                  />
                </div>

                <div className={styles.overlay}>
                  <h2 className={styles.gameTitle}>{game.name}</h2>
                </div>

                <span className={styles.cardShine} aria-hidden="true" />
              </div>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}
