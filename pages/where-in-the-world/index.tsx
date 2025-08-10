'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import styles from '../../styles/where-in-the-world.module.css';
import countriesDataRaw from '../../public/data/countries.json';

const WorldMap = dynamic(() => import('../../components/WorldMap'), { ssr: false });

// ---- Types ----
type CountryRecord = {
  name: string | string[];   // can be a single name or aliases
  lat: number;
  lng: number;
  continent: string;
};

// For strong typing of the imported JSON
const countriesData = countriesDataRaw as CountryRecord[];

// ---- Helpers ----

// Remove accents, collapse punctuation/spaces, lowercase
function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[\s\.\-_'’]+/g, ' ')
    .trim()
    .toLowerCase();
}

function aliasesOf(c: CountryRecord): string[] {
  return Array.isArray(c.name) ? c.name : [c.name];
}

// Use the first alias as the canonical display name (what we push to guessed list / send to map)
function canonicalName(c: CountryRecord): string {
  return aliasesOf(c)[0];
}

export default function WhereInTheWorld() {
  const [targetCountry, setTargetCountry] = useState<CountryRecord | null>(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [guessCoords, setGuessCoords] = useState<[number, number] | null>(null);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);

  // keep all guessed canonical names
  const [guessedCountries, setGuessedCountries] = useState<string[]>([]);

  // Build a lookup of normalized alias -> CountryRecord (faster matching)
  const aliasMap = useMemo(() => {
    const m = new Map<string, CountryRecord>();
    for (const c of countriesData) {
      for (const alias of aliasesOf(c)) {
        m.set(normalize(alias), c);
      }
    }
    return m;
  }, []);

  useEffect(() => {
    const random = countriesData[Math.floor(Math.random() * countriesData.length)];
    setTargetCountry(random);
  }, []);

  const toRad = (val: number) => (val * Math.PI) / 180;

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  };

  function resolveGuess(input: string): CountryRecord | undefined {
    return aliasMap.get(normalize(input));
  }

  const handleGuess = () => {
    const guessed = resolveGuess(guess);
    if (!guessed) {
      setFeedback('❌ Invalid country name.');
      return;
    }

    // pan/zoom to guessed country
    setGuessCoords([guessed.lat, guessed.lng]);

    // remember this guess by canonical name (avoids dupes & matches your GeoJSON labels)
    const guessedCanon = canonicalName(guessed);
    setGuessedCountries((prev) =>
      prev.includes(guessedCanon) ? prev : [...prev, guessedCanon]
    );

    if (!targetCountry) return;

    const targetCanon = canonicalName(targetCountry);

    if (guessedCanon === targetCanon) {
      setIsCorrectGuess(true);
      setFeedback('🎉 Congratulations, you have guessed the correct country!');
      return;
    }

    const correctContinent = guessed.continent === targetCountry.continent;
    const distance = Math.round(
      haversineDistance(guessed.lat, guessed.lng, targetCountry.lat, targetCountry.lng)
    );

    const continentMsg = correctContinent ? '✅ Same continent!' : '❌ Different continent.';
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
    setGuessedCountries([]); // clear highlights
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
          onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
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

      <WorldMap
        guessCoords={guessCoords}
        guessed={guessedCountries}
        correctCountryName={isCorrectGuess && targetCountry ? canonicalName(targetCountry) : null}
      />
    </div>
  );
}
