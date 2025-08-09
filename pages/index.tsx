import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
  const games = [
    {
      name: 'Love Score Calculator',
      path: '/love-score',
      image: '/images/love_score_logo.png',
    },
    {
      name: 'Wordle',
      path: '/wordle',
      image: '/images/wordle_game_logo.png',
    },
    {
      name: 'Blackjack',
      path: '/blackjack',
      image: '/images/blackjack_logo.png',
    },
    {
      name: 'Guessing Game',
      path: '/guessing-game',
      image: '/images/guessing_game_logo.png',
    },
    {
      name: 'Where in the World?',
      path: '/where-in-the-world',
      image: '/images/world_guess_logo.png'
    },
    {
      name: 'Flag Battle',
      path: '/flag-battle',
      image: '/images/flag_battle_logo.png'
    },
    {
      name: 'Higher or Lower',
      path: '/higher_lower',
      image: '/images/higher_lower_logo.png'
    }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Zaka&apos;s Game Hub</h1>
      <div className={styles.grid}>
        {games.map((game) => (
          <Link href={game.path} key={game.name} className={styles.card}>
            <div className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className={styles.image}
                />
              </div>
              <div className={styles.overlay}>
                <h2 className={styles.gameTitle}>{game.name}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
