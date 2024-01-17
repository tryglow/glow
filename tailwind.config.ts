import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./{components,app,lib}/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        system: {
          bg: {
            primary: 'rgb(var(--color-sys-bg-primary) / <alpha-value>)',
            secondary: 'rgb(var(--color-sys-bg-secondary) / <alpha-value>)',
            tertiary: 'rgb(var(--color-sys-bg-tertiary) / <alpha-value>)',
          },
          label: {
            primary: 'rgb(var(--color-sys-label-primary) / <alpha-value>)',
            secondary: 'rgb(var(--color-sys-label-secondary) / <alpha-value>)',
            tertiary: 'rgb(var(--color-sys-label-tertiary) / <alpha-value>)',
            quaternary:
              'rgb(var(--color-sys-label-quaternary) / <alpha-value>)',
            positive: 'rgb(var(--color-sys-label-positive) / <alpha-value>)',
            negative: 'rgb(var(--color-sys-label-negative) / <alpha-value>)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
export default config
