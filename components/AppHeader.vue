<template>
  <div class="page-header">
    <div class="container">
      <div class="logo">Smilegate®</div>
      <div class="logo-subtitle">Vietnam</div>
      <h1 class="page-title">{{ title }}</h1>
      <ul class="features-list">
        <li v-for="feature in features" :key="feature">{{ feature }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  features: string[]
}

defineProps<Props>()
</script> 