import uiConfig from '@trylinky/ui/tailwind.config';
import type { Config } from 'tailwindcss';

const config: Config = {
  ...uiConfig,
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    '../package.ui/src/**/*.{ts,tsx}',
    '../package.common/src/**/*.{ts,tsx}',
  ],
};

export default config;
