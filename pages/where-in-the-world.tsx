'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../styles/where-in-the-world.module.css';
import countriesData from '../public/data/countries.json';
import type { LatLngExpression } from 'leaflet';

// Function to calculate distance between two lat/lng pairs
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (val: number) => (val * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

// Zoom the map to given coordinates
function FlyToLocation({ coords }: { coords: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 4);
  }, [coords, map]);
  return null;
}

export default function CountryGuessGame() {
  const [targetCountry, setTargetCountry] = useState<any>(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [guessCoords, setGuessCoords] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    const random = countriesData[Math.floor(Math.random() * countriesData.length)];
    setTargetCountry(random);
  }, []);

  const handleGuess = () => {
    const guessed = countriesData.find(
      (c) => c.name.toLowerCase() === guess.toLowerCase()
    );

    if (!guessed) {
      setFeedback('Invalid country name.');
      return;
    }

    const coords: LatLngExpression = [guessed.lat, guessed.lng];
    setGuessCoords(coords);

    const correctContinent = guessed.continent === targetCountry.continent;
    const distance = Math.round(
      haversineDistance(guessed.lat, guessed.lng, targetCountry.lat, targetCountry.lng)
    );

    const continentMsg = correctContinent
      ? 'Same continent!'
      : 'Different continent.';
    const distanceMsg = `📍 Distance: ${distance} miles`;

    setFeedback(`${continentMsg} ${distanceMsg}`);
    setGuess('');
  };

  const mapCenter: LatLngExpression = [20, 0];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Where in the World?</h1>
      <p className={styles.subtitle}>Guess the target country!</p>

      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Enter a country"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleGuess} className={styles.button}>
          Guess
        </button>
      </div>

      <p className={styles.feedback}>{feedback}</p>

      <MapContainer
        center={mapCenter}
        zoom={2}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {guessCoords && <FlyToLocation coords={guessCoords} />}
      </MapContainer>
    </div>
  );
}
