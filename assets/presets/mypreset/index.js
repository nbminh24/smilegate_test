export default {
  toast: {
    root: {
      class: [
        'w-96', // Width
        'opacity-90',
        'rounded-lg',
        'shadow-lg',
        'border-0',
        'font-sans',
        'text-sm',
        'font-normal',
        'pointer-events-auto',
        'overflow-hidden',
        'z-50'
      ]
    },
    message: {
      class: [
        'flex',
        'items-center',
        'p-4'
      ]
    },
    icon: {
      class: [
        'w-6',
        'h-6',
        'text-lg',
        'mr-3',
        'flex-shrink-0'
      ]
    },
    text: {
      class: [
        'flex-1',
        'text-left',
        'leading-relaxed'
      ]
    },
    summary: {
      class: [
        'block',
        'font-semibold',
        'mb-1'
      ]
    },
    detail: {
      class: [
        'block',
        'text-sm',
        'opacity-90'
      ]
    },
    closebutton: {
      class: [
        'flex',
        'items-center',
        'justify-center',
        'w-6',
        'h-6',
        'text-gray-500',
        'hover:text-gray-700',
        'rounded-full',
        'transition-colors',
        'duration-200',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2',
        'focus:ring-offset-white',
        'focus:ring-primary-500',
        'dark:focus:ring-offset-gray-900',
        'dark:text-gray-400',
        'dark:hover:text-gray-200',
        'ml-4',
        'flex-shrink-0'
      ]
    },
    closeicon: {
      class: ['w-4', 'h-4']
    },
    // Severity specific styles
    success: {
      class: ['bg-green-100', 'text-green-700', 'border-green-300']
    },
    info: {
      class: ['bg-blue-100', 'text-blue-700', 'border-blue-300']
    },
    warn: {
      class: ['bg-amber-100', 'text-amber-700', 'border-amber-300']
    },
    error: {
      class: ['bg-red-100', 'text-red-700', 'border-red-300']
    }
  }
}
