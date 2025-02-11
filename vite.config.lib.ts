/// <reference types="vitest" />
import { resolve } from 'path'
import { defineConfig } from "vite"

export default defineConfig({
    base: '/',
    build: {
        // Build only rolodex.ts into ../dist
        emptyOutDir: true, // Clear ../dist before building
        lib: {
            entry: resolve(__dirname, 'src/lib/rolodex.ts'),
            name: 'rolodex',
        },
        minify: 'esbuild', // default for client builds
        outDir: 'dist/lib',
        rollupOptions: {
            // Externalize unwanteed dependeancies
            external: [''],
        }, // underlying rollup config options
        target: 'modules', // default
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './'),
            '@src': resolve(__dirname, './src/lib'),
            '@test': resolve(__dirname, './tests'),
        },
    },
    test: {
        browser: {
            enabled: true,
            name: 'chromium',
            provider: 'playwright',
            // testerHtmlPath: '',
        },
        poolMatchGlobs: [
            ['**/tests/web-component/**', 'browser'],
            ['**/tests/unit/**', 'threads'],
        ],
    },
})
