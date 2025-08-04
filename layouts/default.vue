<template>
  <div>
    <slot />
    <Toast 
      position="top-right" 
      group="br"
      :pt="{
        root: { class: 'opacity-95' },
        message: ({ props }) => ({
          class: [
            'flex items-center w-full max-w-md p-4 rounded-lg shadow-lg border-l-4',
            {
              'border-green-500 bg-green-50 text-green-800': props.message.severity === 'success',
              'border-red-500 bg-red-50 text-red-800': props.message.severity === 'error',
              'border-blue-500 bg-blue-50 text-blue-800': props.message.severity === 'info',
              'border-orange-500 bg-orange-50 text-orange-800': props.message.severity === 'warn',
            }
          ],
          enterFromClass: 'opacity-0 translate-x-full',
          enterActiveClass: 'transition-transform transition-opacity duration-300 ease-out',
          enterToClass: 'opacity-100 translate-x-0',
          leaveFromClass: 'opacity-100 translate-x-0',
          leaveActiveClass: 'transition-transform transition-opacity duration-300 ease-in',
          leaveToClass: 'opacity-0 translate-x-full',
        }),
        content: { class: 'flex items-center gap-3' },
        icon: ({ props }) => ({
          class: [
            'text-2xl',
            {
              'text-green-500': props.message.severity === 'success',
              'text-red-500': props.message.severity === 'error',
              'text-blue-500': props.message.severity === 'info',
              'text-orange-500': props.message.severity === 'warn',
            }
          ]
        }),
        text: { class: 'flex flex-col flex-1 ml-2' },
        summary: { class: 'font-bold text-sm' },
        detail: { class: 'text-sm font-normal' },
        closeButton: { class: 'hidden' },
        closeIcon: { class: 'hidden' }
      }"
    />
  </div>
</template>

<script setup>
</script>

<style>
/* You can add global styles here if needed */
</style>
