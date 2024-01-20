'use client';
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
  throw Error('Mapbox access token not found in environment variables');
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface Props {
  className?: string;
  coords: {
    long: number;
    lat: number;
  };
}

export function MapboxMap({ className, coords }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map when component mounts
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11', // Specify the map style
      center: [coords.long, coords.lat], // Specify the initial map center coordinates
      zoom: 14, // Specify the initial zoom level
      interactive: false,
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // Empty dependency array ensures map only initialized once

  return (
    <div
      ref={mapContainerRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
