import { defineConfig } from '@tofrankie/eslint'

export default defineConfig(
  {
    ignores: ['node_modules', 'dist', 'docs', '**/*.md'],
    typescript: true,
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'e18e/prefer-static-regex': 'off',
    },
  }
)
