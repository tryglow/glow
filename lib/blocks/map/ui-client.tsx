'use client';

import mapboxgl, { Map } from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';

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
  const mapBoxRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map when component mounts
    mapBoxRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Specify the map style
      center: [coords.long, coords.lat], // Specify the initial map center coordinates
      zoom: 12, // Specify the initial zoom level
      interactive: false,
    });

    // Clean up on unmount
    return () => mapBoxRef.current?.remove();
  }, [coords]); // Empty dependency array ensures map only initialized once

  useEffect(() => {
    if (!mapBoxRef.current || !mapContainerRef.current) return;

    const resizer = new ResizeObserver(
      debounce(() => mapBoxRef.current?.resize(), 10)
    );

    resizer.observe(mapContainerRef.current);

    return () => {
      resizer.disconnect();
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

function debounce<F extends (...args: any[]) => void>(
  func: F,
  waitFor: number
): (this: ThisParameterType<F>, ...args: Parameters<F>) => void {
  let timeoutId: number | undefined;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func.apply(this, args), waitFor);
  };
}