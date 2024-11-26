import path from 'path'
import { defineConfig } from "vite"

export default defineConfig({
        build: {
                lib: {
                        entry: 'index.js',
                        filename: 'rolodex', // Name of the output
                        name: 'rolodex', // Namespace of exposed global variable
                },
                minify: 'esbuild', // default
                outDir: 'dist', // default
                rollupOptions: {}, // underlying rollup config options
                target: 'modules', // default
        },
        resolve: {
                alias: {
                        '@': path.resolve(__dirname, './'),
                },
        },
})
