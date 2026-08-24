import studio from '@sanity/eslint-config-studio'
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['sanity.types.ts']),
    ...studio
])
