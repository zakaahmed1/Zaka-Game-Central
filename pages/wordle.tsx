import { useEffect, useState } from 'react';
import styles from '../styles/Wordle.module.css';
import { evaluateGuess, updateKeyboard } from '../utils/wordleLogic';
import Link from 'next/link';

const WORD_LENGTH = 5;
const MAX_TURNS = 6;

const getWordList = async (): Promise<string[]> => {
  const res = await fetch('/valid-wordle-words.txt');
  const text = await res.text();
  return text.split('\n').map(w => w.trim().toLowerCase()).filter(Boolean);
};

export default function Wordle() {
  const [wordList, setWordList] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<any[][]>([]);
  const [input, setInput] = useState('');
  const [keyboard, setKeyboard] = useState<{ [key: string]: string }>({});
  const [gameover, setGameover] = useState(false);
  const [won, setWon] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getWordList().then(words => {
      setWordList(words);
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setAnswer(randomWord);
    });
    setKeyboard(Object.fromEntries('abcdefghijklmnopqrstuvwxyz'.split('').map(l => [l, ''])));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameover) return;

      if (e.key === 'Enter') {
        handleSubmit();
      } else if (e.key === 'Backspace') {
        setInput(prev => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key) && input.length < WORD_LENGTH) {
        setInput(prev => prev + e.key.toLowerCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, gameover]);

  const handleSubmit = () => {
    const guess = input.toLowerCase();
    if (guess.length !== WORD_LENGTH || !wordList.includes(guess)) {
      setError('Invalid guess.');
      return;
    }

    setError('');
    const result = evaluateGuess(guess, answer);
    setFeedback(prev => [...prev, result]);
    setGuesses(prev => [...prev, guess]);
    setKeyboard(prev => updateKeyboard({ ...prev }, result));
    setInput('');

    if (result.every(([color]) => color === 'green')) {
      setGameover(true);
      setWon(true);
    } else if (guesses.length + 1 >= MAX_TURNS) {
      setGameover(true);
    }
  };

  const handleReset = () => window.location.reload();

  const handleKeyClick = (key: string) => {
    if (gameover) return;

    if (key === 'Enter') {
      handleSubmit();
    } else if (key === 'Backspace') {
      setInput(prev => prev.slice(0, -1));
    } else if (/^[a-z]$/.test(key) && input.length < WORD_LENGTH) {
      setInput(prev => prev + key);
    }
  };

  const keyboardRows = [
    'qwertyuiop'.split(''),
    'asdfghjkl'.split(''),
    ['Enter', ...'zxcvbnm'.split(''), 'Backspace']
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Zaka's Wordle App</h1>

      <div className={styles.grid}>
        {[...Array(MAX_TURNS)].map((_, row) => (
          <div key={row} className={styles.row}>
            {[...Array(WORD_LENGTH)].map((_, col) => {
              const letter = guesses[row]?.[col] || '';
              const color = feedback[row]?.[col]?.[0] || '';
              return (
                <div key={col} className={`${styles.cell} ${styles[color]}`}>
                  {letter.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {gameover && (
        <p className={won ? styles.win : styles.lose}>
          {won ? '🎉 You won!' : `❌ Game over. The word was "${answer.toUpperCase()}".`}
        </p>
      )}

      {!gameover && (
        <>
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              value={input}
              maxLength={WORD_LENGTH}
              onChange={e => setInput(e.target.value.toLowerCase())}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
            <button className={styles.button} onClick={handleSubmit}>Guess</button>
          </div>
        </>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <h3>Keyboard</h3>
      <div className={styles.keyboard}>
        {keyboardRows.map((row, i) => (
          <div key={i} className={styles.keyboardRow}>
            {row.map((key) => (
              <button
                key={key}
                className={`${styles.key} ${key === 'Enter' || key === 'Backspace' ? styles.wideKey : ''
                  }`}
                onClick={() => handleKeyClick(key.toLowerCase())}
                disabled={
                  keyboard[key.toLowerCase()] &&
                  key !== 'Enter' &&
                  key !== 'Backspace'
                }
              >
                {key === 'Backspace' ? 'UNDO' : key.toUpperCase()}
              </button>
            ))}
          </div>
        ))}
      </div>

      <button className={styles.button} onClick={handleReset}>Reset</button>

      <Link href="/" legacyBehavior>
        <a
          style={{
            marginTop: '2rem',
            display: 'inline-block',
            padding: '0.5rem 1rem',
            border: '1px solid #ccc',
            borderRadius: '5px',
            textDecoration: 'none',
            backgroundColor: '#f0f0f0'
          }}
        >
          ← Back
        </a>
      </Link>
    </div>
  );
}
