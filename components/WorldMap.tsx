'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';
import styles from '../styles/where-in-the-world.module.css';

type Props = {
  guessCoords: LatLngExpression | null;
};

function FlyToLocation({ coords }: { coords: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 4);
    }
  }, [coords, map]);

  return null;
}

export default function WorldMap({ guessCoords }: Props) {
  const initialCenter: LatLngExpression = [20, 0];

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={initialCenter}
        zoom={2}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {guessCoords && <FlyToLocation coords={guessCoords} />}
      </MapContainer>
    </div>
  );
}
