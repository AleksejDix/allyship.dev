import { defineConfig } from 'vite'

export default defineConfig({
  root: 'benchmarks',
  publicDir: false,
  server: {
    port: 3000,
    open: '/baseline.html',
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  build: {
    outDir: 'dist-benchmarks',
    rollupOptions: {
      input: {
        baseline: 'benchmarks/baseline.html',
        'benchmark-runner': 'benchmarks/benchmark-runner.html',
        'stress-test-1k': 'benchmarks/stress-test-1k.html',
        'stress-test-10k': 'benchmarks/stress-test-10k.html',
        'stress-test-100k': 'benchmarks/stress-test-100k.html'
      }
    }
  },
  optimizeDeps: {
    exclude: ['@allystudio/act-test-runner']
  }
})
