import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

/**
 * ESLint flat config.
 *
 * `npm run lint` was dead for two independent reasons, so nothing in this repo
 * was linted at all:
 *
 *   1. ESLint 9 reads eslint.config.* and ignores .eslintrc.json outright, so
 *      the old config was never loaded — the run failed before reading a file.
 *   2. The old config extended "plugin:prettier/recommended", but
 *      eslint-plugin-prettier and eslint-config-prettier are not dependencies
 *      of this repo and never have been. That extend could not resolve under
 *      the legacy loader either.
 *
 * Prettier is therefore not wired into ESLint here. `prettier` is still a
 * devDependency and can be run directly; formatting is not a lint error. If
 * running it through ESLint is wanted, install eslint-plugin-prettier and
 * eslint-config-prettier first and add them below — do not re-add the extend
 * on its own, which is what broke this the first time.
 *
 * FlatCompat is what bridges eslint-config-next, which still ships as a legacy
 * shareable config. @eslint/eslintrc was already a devDependency for this.
 */
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

export default [
  {
    // Flat config does not read .eslintignore, so ignores live here. The old
    // .eslintrc.json and .eslintignore were deleted with this change rather
    // than left in place: ESLint 9 reads neither, and a config file that
    // silently does nothing is what hid the broken lint in the first place.
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      '**/generated/**',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // The repo already marks deliberately-unused bindings with a leading
      // underscore (catch params in the preview scripts, for one). Honour that
      // convention instead of forcing a rename or a disable comment.
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    // The eval suite is CommonJS run by `node --test`, not bundled app code.
    // require() is the correct call there, so the ESM-only rule does not apply.
    files: ['evals/**/*.js'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
];
