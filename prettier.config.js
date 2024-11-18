/** @type {import("prettier").Config} */
const config = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  skipDestructiveCodeActions: false,
};

module.exports = config;
