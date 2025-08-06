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
  const [setupComplete, setSetupComplete] = useState(false);
  const [playerNames, setPlayerNames] = useState({ p1: '', p2: '' });

  const renderLives = (lives: number) => {
    return <span className={styles.lives}>{'X'.repeat(lives)}</span>;
  };

  const handleGuess = () => {
    if (gameOver) return;

    const isCorrect = currentFlag.name.some(
  (name) => name.toLowerCase() === guess.trim().toLowerCase()
);

    if (isCorrect) {
      setMessage(`✅ Correct! ${playerNames[currentPlayer]} scores!`);
    } else {
      const newLives = { ...playerLives };
      newLives[currentPlayer] -= 1;
      setPlayerLives(newLives);

      if (newLives[currentPlayer] === 0) {
        const winner = currentPlayer === 'p1' ? playerNames.p2 : playerNames.p1;
        setMessage(`❌ Wrong! ${playerNames[currentPlayer]} is out! ${winner} wins!`);
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

  const handleSetupSubmit = () => {
    if (playerNames.p1.trim() && playerNames.p2.trim()) {
      setSetupComplete(true);
    }
  };

  if (!setupComplete) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Enter Player Names</h1>
        <input
          type="text"
          placeholder="Player 1 Name"
          value={playerNames.p1}
          onChange={(e) => setPlayerNames({ ...playerNames, p1: e.target.value })}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Player 2 Name"
          value={playerNames.p2}
          onChange={(e) => setPlayerNames({ ...playerNames, p2: e.target.value })}
          className={styles.input}
        />
        <button onClick={handleSetupSubmit} className={styles.button}>Start Game</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Flag Battle</h1>
      <div className={styles.scoreboard}>
        <span>{playerNames.p1} {renderLives(playerLives.p1)}</span>
        <span>{playerNames.p2} {renderLives(playerLives.p2)}</span>
      </div>
      <img
        src={currentFlag.flagUrl}
        alt="Country Flag"
        className={styles.flag}
      />
      <p className={styles.turn}>
        {gameOver ? 'Game Over' : `${playerNames[currentPlayer]}'s Turn`}
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
