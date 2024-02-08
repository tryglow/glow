'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { toast } from '@/components/ui/use-toast';

export function ShowLoginAlert() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get('error')) {
      setTimeout(() => {
        toast({
          title: 'Login failed',
          variant: 'error',
        });
      }, 500);
    }
  }, [params]);

  return <></>;
}
