import { defineConfig, presetUno, presetIcons, presetTypography } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetTypography()
  ],
  theme: {
    colors: {
      'smilegate-blue': '#0066CC',
      'smilegate-dark': '#004499',
      'smilegate-light': '#E6F3FF',
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
  },
  shortcuts: {
    'btn-primary': 'bg-smilegate-blue hover:bg-smilegate-dark text-white px-4 py-2 rounded-lg transition-colors duration-200',
    'btn-secondary': 'bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-200',
    'card': 'bg-white rounded-lg shadow-md border border-gray-200',
    'input-field': 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smilegate-blue focus:border-transparent',
  },
  rules: [
    ['text-gradient', { 'background': 'linear-gradient(45deg, #0066CC, #004499)', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent' }]
  ]
}) 