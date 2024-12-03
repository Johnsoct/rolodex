/// <reference types="vitest" />
import { resolve } from 'path'
import { defineConfig } from "vite"

export default defineConfig({
        build: {
                lib: {
                        entry: resolve(__dirname, 'src/index.ts'),
                        name: 'rolodex',
                },
                minify: 'esbuild', // default
                outDir: 'dist', // default
                rollupOptions: {
                        // Externalize unwanteed dependeancies
                        external: [''],
                }, // underlying rollup config options
                target: 'modules', // default
        },
        resolve: {
                alias: {
                        '@': resolve(__dirname, './'),
                        '@src': resolve(__dirname, './src'),
                        '@test': resolve(__dirname, './tests'),
                },
        },
        root: 'src',
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