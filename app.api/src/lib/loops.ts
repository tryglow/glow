import { LoopsClient } from 'loops';

export const createLoopsClient = () => {
  if (!process.env.LOOPS_API_KEY) {
    console.warn('LOOPS API KEY is not set');
    return null;
  }

  return new LoopsClient(process.env.LOOPS_API_KEY);
};
