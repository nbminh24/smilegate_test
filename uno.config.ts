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
    // Buttons: Refined padding and font weight for a more solid feel
    'btn-primary': 'bg-smilegate-blue hover:bg-smilegate-dark text-white px-5 py-2 rounded-xl transition-all duration-300 font-bold shadow-md hover:shadow-lg hover:transform hover:scale-105',
    'btn-secondary': 'bg-white hover:bg-gray-100 text-gray-800 px-5 py-2 rounded-xl transition-all duration-300 font-bold border border-gray-300 shadow-md hover:shadow-lg hover:transform hover:scale-105',
    'btn-danger': 'bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition-all duration-300 font-bold shadow-md hover:shadow-lg hover:transform hover:scale-105',

    // Cards & Layout: Increased padding and refined shadows
    'card': 'bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300',
    'card-header': 'bg-gray-50/50 text-gray-900 p-5 font-bold border-b border-gray-200 rounded-t-2xl',
    'input-field': 'w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-smilegate-blue focus:border-transparent transition-all duration-200 bg-white',

    // Table: Improved spacing and row separation
    'table-header': 'text-xs text-gray-500 uppercase tracking-wider font-bold',
    'table-row': 'py-3 border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200',
    'table-cell': 'px-6 py-6 whitespace-nowrap',

    // Misc
    'language-flag': 'w-6 h-6 rounded-full border-2 border-white shadow-sm',
  },
  rules: [
    ['text-gradient', { 'background': 'linear-gradient(45deg, #0066CC, #004499)', '-webkit-background-clip': 'text', '-webkit-text-fill-color': 'transparent' }]
  ]
}) 