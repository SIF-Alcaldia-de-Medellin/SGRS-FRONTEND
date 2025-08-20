/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
    css: true,
    coverage: {
      provider: 'istanbul',    // usa 'c8' para cobertura, que es compatible con lcov
      reporter: ['lcov', 'text'], // 'lcov' es el formato esperado por SonarCloud
      reportsDirectory: 'coverage', // Puedes elegir el directorio donde guardar la cobertura
    },
  },
})
