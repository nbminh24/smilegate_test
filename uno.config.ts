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
      'smilegate-orange': '#FF6B35',
      'smilegate-gray': '#6B7280',
      'smilegate-dark-gray': '#374151',
      'smilegate-light-gray': '#F9FAFB',
    },
    fontFamily: {
      sans: ['Inter', 'Poppins', 'Exo 2', 'system-ui', 'sans-serif'],
    },
  },
  shortcuts: {
    'btn-primary': 'bg-smilegate-blue hover:bg-smilegate-dark text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md',
    'btn-secondary': 'bg-smilegate-light-gray hover:bg-gray-200 text-smilegate-dark-gray px-4 py-3 rounded-lg transition-all duration-200 font-medium border border-gray-300',
    'btn-danger': 'bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md',
    'btn-orange': 'bg-smilegate-orange hover:bg-orange-600 text-white px-4 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md',
    'card': 'bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300',
    'card-header': 'bg-gradient-to-r from-smilegate-blue to-smilegate-dark text-white p-6 rounded-t-xl',
    'input-field': 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smilegate-blue focus:border-transparent transition-all duration-200',
    'hero-banner': 'bg-gradient-to-br from-smilegate-blue via-smilegate-dark to-purple-900 text-white',
    'table-row': 'hover:bg-smilegate-light-gray transition-colors duration-200 border-b border-gray-100',
    'language-flag': 'w-6 h-6 rounded-full border-2 border-gray-200 shadow-sm',
  },
  rules: [
    ['text-gradient', { 'background': 'linear-gradient(45deg, #0066CC, #004499)', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent' }]
  ]
}) 