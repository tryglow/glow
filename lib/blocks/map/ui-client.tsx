'use client';
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapBlockConfig } from './config';

if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
  throw Error('Mapbox access token not found in environment variables');
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type Props = {
  className?: string;
} & MapBlockConfig;

export function MapboxMap({ className, coords }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map when component mounts
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Specify the map style
      center: [coords.long, coords.lat], // Specify the initial map center coordinates
      zoom: 12, // Specify the initial zoom level
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
