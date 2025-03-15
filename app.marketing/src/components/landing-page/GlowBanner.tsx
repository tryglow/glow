'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function GlowBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <Link
      href="/i/blog/hello-linky"
      className="fixed bottom-4 right-4 z-50 animate-fade-in group"
    >
      <div className="bg-card text-card-foreground border shadow-lg hover:shadow-md transition-shadow rounded-2xl px-4 py-4 flex text-left flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-medium">Glow is now Linky!</span>
        </div>
        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
          Read our announcement{' '}
          <span className="group-hover:translate-x-1 transition-transform inline-block">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
