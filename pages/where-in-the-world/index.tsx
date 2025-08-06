'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import styles from '../../styles/where-in-the-world.module.css';
import countriesData from '../../public/data/countries.json';

const WorldMap = dynamic(() => import('../../components/WorldMap'), { ssr: false });

export default function WhereInTheWorld() {
  const [targetCountry, setTargetCountry] = useState<any>(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [guessCoords, setGuessCoords] = useState<[number, number] | null>(null);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);

  useEffect(() => {
    const random = countriesData[Math.floor(Math.random() * countriesData.length)];
    setTargetCountry(random);
  }, []);

  const toRad = (val: number) => (val * Math.PI) / 180;

  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 3958.8; // Earth radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  };

  const handleGuess = () => {
    const guessed = countriesData.find(
      (c) => c.name.toLowerCase() === guess.toLowerCase()
    );

    if (!guessed) {
      setFeedback('❌ Invalid country name.');
      return;
    }

    const coords: [number, number] = [guessed.lat, guessed.lng];
    setGuessCoords(coords);

    if (guessed.name === targetCountry.name) {
      setIsCorrectGuess(true);
      setFeedback('🎉 Congratulations, you have guessed the correct country!');
      return;
    }

    const correctContinent = guessed.continent === targetCountry.continent;
    const distance = Math.round(
      haversineDistance(
        guessed.lat,
        guessed.lng,
        targetCountry.lat,
        targetCountry.lng
      )
    );

    const continentMsg = correctContinent
      ? '✅ Same continent!'
      : '❌ Different continent.';
    const distanceMsg = `📍 Distance: ${distance} miles`;

    setFeedback(`${continentMsg} ${distanceMsg}`);
    setGuess('');
  };

  const handlePlayAgain = () => {
    const random = countriesData[Math.floor(Math.random() * countriesData.length)];
    setTargetCountry(random);
    setGuess('');
    setGuessCoords(null);
    setFeedback('');
    setIsCorrectGuess(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🌎 Where in the World?</h1>
      <p className={styles.subtitle}>Guess the target country!</p>

      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Enter a country"
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

      <p className={styles.feedback}>{feedback}</p>

      {isCorrectGuess && (
        <button onClick={handlePlayAgain} className={styles.button}>
          Play Again
        </button>
      )}

      <WorldMap guessCoords={guessCoords} />
    </div>
  );
}
