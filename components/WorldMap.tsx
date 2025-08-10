'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import type { Feature, FeatureCollection } from 'geojson';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';
import styles from '../styles/where-in-the-world.module.css';

type Props = {
  guessCoords: LatLngExpression | null;
  guessed: string[];                 // names of guessed countries
  correctCountryName: string | null; // when guessed correctly
};

function FlyToLocation({ coords }: { coords: LatLngExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, Math.max(map.getZoom(), 4), { duration: 0.9 });
  }, [coords, map]);
  return null;
}

export default function WorldMap({ guessCoords, guessed, correctCountryName }: Props) {
  const initialCenter: LatLngExpression = [20, 0];
  const [worldGeo, setWorldGeo] = useState<FeatureCollection | null>(null);
  const geoRef = useRef<L.GeoJSON | null>(null);

  // Load world countries polygons
  useEffect(() => {
    fetch('/data/world-countries.geo.json')
      .then((r) => r.json())
      .then((data) => setWorldGeo(data))
      .catch((e) => console.error('Failed to load world-countries.geo.json', e));
  }, []);

  // Normalize feature name across common property keys
  const getName = (f: Feature) =>
    (f.properties as any)?.name ||
    (f.properties as any)?.NAME ||
    (f.properties as any)?.ADMIN ||
    (f.properties as any)?.ADMIN_NAME ||
    '';

  // Base styles
  const defaultStyle = useMemo(
    () => ({
      color: '#6b7280', // gray outline
      weight: 1,
      fillColor: '#111827',
      fillOpacity: 0.15,
    }),
    []
  );

  const guessedStyle = {
    color: '#ff2ea6',   // magenta
    weight: 1.5,
    fillColor: '#ff2ea6',
    fillOpacity: 0.28,
  };

  const correctStyle = {
    color: '#22c55e',   // green
    weight: 2,
    fillColor: '#22c55e',
    fillOpacity: 0.35,
  };

  const styleForFeature = (feature: Feature) => {
    const name = getName(feature);
    if (correctCountryName && name === correctCountryName) return correctStyle;
    if (guessed.includes(name)) return guessedStyle;
    return defaultStyle;
  };

  // Re-style polygons when guesses change (without reloading layer)
  useEffect(() => {
    if (!geoRef.current) return;
    // @ts-ignore leaflet typing
    geoRef.current.eachLayer((layer: any) => {
      const f = layer.feature as Feature | undefined;
      if (!f) return;
      layer.setStyle(styleForFeature(f));
    });
  }, [guessed, correctCountryName]); // re-run styling when these change

  return (
    <div className={styles.map}>
      <MapContainer
        center={initialCenter}
        zoom={2}
        scrollWheelZoom
        className={styles.map}
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
        />

        <FlyToLocation coords={guessCoords} />

        {worldGeo && (
          <GeoJSON
            data={worldGeo as any}
            style={styleForFeature}
            // @ts-ignore
            ref={(ref) => (geoRef.current = ref)}
          />
        )}
      </MapContainer>
    </div>
  );
}
