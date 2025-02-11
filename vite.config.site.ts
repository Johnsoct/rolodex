/// <reference types="vitest" />
import { resolve } from "path"
import { defineConfig } from "vite"

export default defineConfig({
    base: '/rolodex/',
    build: {
        // Build only rolodex.ts into ../dist
        emptyOutDir: true, // Clear ../dist before building
        minify: 'esbuild', // default for client builds
        outDir: '../dist/site',
        rollupOptions: {
            // Externalize unwanteed dependeancies
            external: [''],
        }, // underlying rollup config options
        target: 'modules', // default
    },
    root: './src',
})
