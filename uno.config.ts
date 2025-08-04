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
    'btn-primary': 'bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-xl transition-all duration-300 font-bold shadow-md hover:shadow-lg hover:transform hover:scale-105 border-none outline-none',
    'btn-secondary': 'py-2 px-4 rounded-xl font-semibold transition-colors duration-300 bg-gray-100 text-gray-600 !border-none hover:bg-gray-200 focus:outline-none focus:ring-0 focus:!shadow-none dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
    'btn-add-language': 'bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:transform hover:scale-105 border-none outline-none',
    'btn-danger': 'bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition-all duration-300 font-bold shadow-md hover:shadow-lg hover:transform hover:scale-105 border-none outline-none',
    'btn-action-delete': 'bg-white text-red-500 px-5 py-2 rounded-xl transition-all duration-200 border-none shadow-none outline-none hover:bg-red-600 hover:text-white',
    'btn-warning': 'bg-smilegate-orange hover:bg-orange-600 text-white px-5 py-2 rounded-xl transition-all duration-300 font-bold shadow-md hover:shadow-lg hover:transform hover:scale-105 border-none outline-none',
    'btn-icon-danger': 'flex items-center justify-center w-8 h-8 rounded-full text-gray-400 transition-colors duration-200 bg-transparent !border-none hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-500 focus:outline-none',
    'btn-overlay': 'w-full text-left px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/50 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 ease-in-out',

    // Cards & Layout: Increased padding and refined shadows
    'card': 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300',
    'card-header': 'bg-gray-50/50 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200 p-5 font-semibold border-b border-gray-200 dark:border-gray-700 rounded-t-2xl',
    'input-text': 'w-full text-base bg-gray-100/80 dark:bg-gray-800/80 rounded-xl border-2 border-transparent focus:border-smilegate-dark-gray focus:bg-white dark:focus:bg-gray-900 transition-all duration-300 focus:outline-none px-4 py-3',

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