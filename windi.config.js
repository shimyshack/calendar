import { defineConfig } from 'windicss/helpers'

function range(size, startAt = 1) {
  return Array.from(Array(size).keys()).map(i => i + startAt)
}

export default defineConfig({
  safelist: [
    range(7).map(i => `c-col-start-${i}`), // col-start-1 to col-start-3
  ],
  preflight: false,
  prefix: 'c-'
})