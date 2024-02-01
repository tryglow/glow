import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isObjKey<T extends Object>(
  key: PropertyKey,
  obj: T
): key is keyof T {
  return key in obj;
}
