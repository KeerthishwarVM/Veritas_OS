export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { carbon: '#0A0A0A', grid: '#1E1E1E', bone: '#F2EFE9', orange: '#FF5500', lime: '#CCFF00', crimson: '#FF2A2A' },
      fontFamily: {
        display: ['"Pirata One"', 'Impact', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
}
