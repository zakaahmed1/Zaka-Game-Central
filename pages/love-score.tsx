// pages/index.tsx
import { useState } from 'react';
import styles from '../styles/LoveScore.module.css';
import Link from 'next/link';

export default function Home() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<{ score: number; interpretation: string } | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name1, name2 }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className={styles.container}>
      <h1>💘 Love Score Calculator 💘</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter first name"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Enter second name"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          required
        />
        <button className={styles.button} type="submit">
          Calculate Love Score
        </button>
      </form>

      {result && (
        <div className={styles.result}>
          <h2>
            {name1} + {name2}
          </h2>
          <p>💖 Love Score: <strong>{result.score}</strong></p>
          <p>{result.interpretation}</p>
        </div>
      )}

      <button className={styles.explainButton} onClick={() => setShowExplanation(!showExplanation)}>
        {showExplanation ? 'Hide explanation' : 'How does it work?'}
      </button>

      {showExplanation && (
        <div className={styles.explanation}>
          <p>
            The Love Score is calculated by looking for patterns that match in both of your names.
            <strong> Disclaimer:</strong>This is just for fun, don't blame me if it doesn't work out!
          </p>
        </div>
      )}

      <Link href="/" legacyBehavior>
      <a style={{ marginTop: '2rem', display: 'inline-block', padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', backgroundColor: '#f0f0f0' }}>
       ← Back
      </a>
      </Link>
    </div>
  );
}
