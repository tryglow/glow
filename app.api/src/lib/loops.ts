import { config } from '@/modules/features';
import { LoopsClient } from 'loops';

export const createLoopsClient = () => {
  if (!config.loops.enabled) {
    console.info('Loops is not enabled, skipping client creation');
    return null;
  }

  if (!process.env.LOOPS_API_KEY) {
    console.warn('LOOPS API KEY is not set');
    return null;
  }

  return new LoopsClient(process.env.LOOPS_API_KEY);
};
