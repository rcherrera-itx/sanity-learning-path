import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
    typegen: {
        path: './src/**/*.{ts,tsx}',
        schema: '../studio/schema.json',
        generates: './src/sanity/types.ts',
        overloadClientMethods: true
    },
});