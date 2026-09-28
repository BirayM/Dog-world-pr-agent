import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/**', 'coverage/**', 'playwright-report/**', 'test-results/**'] },
  js.configs.recommended,
  { files: ['src/**', 'tests/**', '*.js'], languageOptions: { globals: globals.node } },
  { files: ['public/**'], languageOptions: { globals: globals.browser } },
];
