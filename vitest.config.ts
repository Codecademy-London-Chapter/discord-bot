import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      ...configDefaults.exclude,
      'packages/template/*'],
  },
})
