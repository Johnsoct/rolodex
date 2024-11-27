import { resolve } from 'path'
import { defineConfig } from "vite"

export default defineConfig({
        build: {
                lib: {
                        entry: resolve(__dirname, 'index.js'),
                        filename: 'rolodex', // Name of the output
                        name: 'rolodex', // Namespace of exposed global variable
                },
                minify: 'esbuild', // default
                outDir: 'dist', // default
                rollupOptions: {
                        // Externalize unwanteed dependeancies
                        external: ['vite'],
                }, // underlying rollup config options
                target: 'modules', // default
        },
        resolve: {
                alias: {
                        '@': resolve(__dirname, './'),
                },
        },
})
