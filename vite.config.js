import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [
        react(),
        svgr(),
    ],
    server: {
        port: 3000,
        open: true
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Three.js in its own chunk — only downloaded when /play is visited
                    'three':         ['three'],
                    // Animation lib
                    'framer-motion': ['framer-motion'],
                    // Core React ecosystem — cached aggressively
                    'vendor':        ['react', 'react-dom', 'react-router-dom', 'styled-components'],
                },
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
    }
});