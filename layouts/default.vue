<template>
  <div>
    <slot />
    <Toast
      position="top-right"
      group="br"
      class="!w-96"
      :pt="{
        root: { 
          class: 'opacity-95 z-50',
        },
        container: {
          class: 'w-full p-4 space-y-4 pointer-events-auto'
        },
        message: ({ props }) => ({
          class: [
            'flex items-center w-full p-4 rounded-lg shadow-lg',
            'border-0',
            'transition-all duration-300 ease-in-out',
            {
              'bg-green-50 text-green-800': props.message.severity === 'success',
              'bg-red-50 text-red-800': props.message.severity === 'error',
              'bg-blue-50 text-blue-800': props.message.severity === 'info',
              'bg-amber-50 text-amber-800': props.message.severity === 'warn',
            }
          ],
          enterFromClass: 'opacity-0 translate-y-2',
          enterActiveClass: 'transition-all duration-200 ease-out',
          enterToClass: 'opacity-100 translate-y-0',
          leaveFromClass: 'opacity-100 translate-y-0',
          leaveActiveClass: 'transition-all duration-200 ease-in',
          leaveToClass: 'opacity-0 translate-y-2',
        }),
        content: { 
          class: 'flex items-center gap-3 w-full' 
        },
        icon: ({ props }) => ({
          class: [
            'text-2xl flex-shrink-0',
            {
              'text-green-500': props.message.severity === 'success',
              'text-red-500': props.message.severity === 'error',
              'text-blue-500': props.message.severity === 'info',
              'text-amber-500': props.message.severity === 'warn',
            }
          ]
        }),
        text: { 
          class: 'flex flex-col flex-1 overflow-hidden' 
        },
        summary: { 
          class: 'font-semibold text-sm leading-tight' 
        },
        detail: { 
          class: 'text-sm font-normal mt-1 leading-tight text-opacity-90' 
        },
        closeButton: { 
          class: 'hidden' 
        },
        closeIcon: { 
          class: 'hidden' 
        }
      }"
    />
  </div>
</template>

<script setup>
</script>

<style>
/* You can add global styles here if needed */
</style>
