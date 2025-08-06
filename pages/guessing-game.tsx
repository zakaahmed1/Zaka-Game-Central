'use client';

import { useState } from 'react';
import styles from '../styles/guessing-game.module.css';

export default function GuessingGame() {
    const [difficulty, setDifficulty] = useState<'easy' | 'hard' | null>(null);
    const [attemptsLeft, setAttemptsLeft] = useState(0);
    const [correctNumber, setCorrectNumber] = useState<number | null>(null);
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState('');
    const [gameOver, setGameOver] = useState(false);

    const startGame = (mode: 'easy' | 'hard') => {
        const attempts = mode === 'easy' ? 10 : 5;
        setDifficulty(mode);
        setAttemptsLeft(attempts);
        setCorrectNumber(Math.floor(Math.random() * 100) + 1);
        setGuess('');
        setFeedback('');
        setGameOver(false);
    };

    const handleGuess = () => {
        if (!guess || isNaN(Number(guess))) {
            setFeedback('Please enter a valid number.');
            return;
        }

        const numericGuess = parseInt(guess);
        if (numericGuess === correctNumber) {
            setFeedback(`You got it! The answer was ${correctNumber}.`);
            setGameOver(true);
        } else {
            const newAttempts = attemptsLeft - 1;
            setAttemptsLeft(newAttempts);
            if (newAttempts === 0) {
                setFeedback(`Game over. The correct number was ${correctNumber}.`);
                setGameOver(true);
            } else {
                setFeedback(numericGuess > correctNumber ? 'Too high. Try again.' : 'Too low. Try again.');
            }
        }
        setGuess('');
    };

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Number Guessing Game</h1>

            {!difficulty ? (
                <>
                    <p className={styles.subtitle}>Choose a difficulty to start:</p>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => startGame('easy')} className={styles.button}>
                            Easy (10 tries)
                        </button>
                        <button onClick={() => startGame('hard')} className={styles.button}>
                            Hard (5 tries)
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <p className={styles.attempts}>Attempts left: {attemptsLeft}</p>
                    <p className={styles.instructions}>Choose a number between 1 and 100</p> {/* New line */}
                    {!gameOver && (
                        <div className={styles.inputGroup}>
                            <input
                                type="number"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleGuess();
                                    }
                                }}
                                className={styles.input}
                            />
                            <button onClick={handleGuess} className={styles.button}>
                                Guess
                            </button>
                        </div>
                    )}
                    <p className={styles.feedback}>{feedback}</p>
                    {gameOver && (
                        <button onClick={() => setDifficulty(null)} className={styles.button}>
                            Play Again
                        </button>
                    )}
                </>

            )}
        </main>
    );
}
