import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
    ],
    server: {
        port: 3000,
        open: true
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Three.js is downloaded only when the game route is visited.
                    'three': ['three'],
                    'framer-motion': ['framer-motion'],
                    'vendor': ['react', 'react-dom', 'react-router-dom', 'styled-components'],
                },
            },
        },
    },
});
