'use client';

import { useState } from 'react';
import styles from '../../styles/flag-battle.module.css';
import { countries, getRandomCountry } from '../../utils/flagData';

export default function FlagBattle() {
  const [playerLives, setPlayerLives] = useState({ p1: 3, p2: 3 });
  const [currentPlayer, setCurrentPlayer] = useState<'p1' | 'p2'>('p1');
  const [currentFlag, setCurrentFlag] = useState(() => getRandomCountry());
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const renderLives = (lives: number) => {
    return (
      <span className={styles.lives}>
        {'X'.repeat(lives)}
      </span>
    );
  };

  const handleGuess = () => {
    if (gameOver) return;

    const isCorrect = guess.trim().toLowerCase() === currentFlag.name.toLowerCase();

    if (isCorrect) {
      setMessage(`✅ Correct! ${currentPlayer === 'p1' ? 'Player 1' : 'Player 2'} scores!`);
    } else {
      const newLives = { ...playerLives };
      newLives[currentPlayer] -= 1;
      setPlayerLives(newLives);

      if (newLives[currentPlayer] === 0) {
        setMessage(`❌ Wrong! Player ${currentPlayer === 'p1' ? '1' : '2'} is out! Player ${currentPlayer === 'p1' ? '2' : '1'} wins!`);
        setGameOver(true);
        return;
      } else {
        setMessage(`❌ Wrong! That was ${currentFlag.name}`);
      }
    }

    setCurrentFlag(getRandomCountry());
    setGuess('');
    setCurrentPlayer(currentPlayer === 'p1' ? 'p2' : 'p1');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  const resetGame = () => {
    setPlayerLives({ p1: 3, p2: 3 });
    setCurrentPlayer('p1');
    setCurrentFlag(getRandomCountry());
    setGuess('');
    setMessage('');
    setGameOver(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Flag Battle</h1>
      <div className={styles.scoreboard}>
        <span>Player 1 {renderLives(playerLives.p1)}</span>
        <span>Player 2 {renderLives(playerLives.p2)}</span>
      </div>
      <img
        src={currentFlag.flagUrl}
        alt="Country Flag"
        className={styles.flag}
      />
      <p className={styles.turn}>
        {gameOver ? 'Game Over' : `${currentPlayer === 'p1' ? 'Player 1' : 'Player 2'}'s Turn`}
      </p>
      {!gameOver && (
        <>
          <input
            type="text"
            placeholder="Guess the country"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={handleKeyPress}
            className={styles.input}
          />
          <button onClick={handleGuess} className={styles.button}>Submit</button>
        </>
      )}
      {message && <p className={styles.message}>{message}</p>}
      {gameOver && (
        <button onClick={resetGame} className={styles.button}>
          Play Again
        </button>
      )}
    </div>
  );
}
