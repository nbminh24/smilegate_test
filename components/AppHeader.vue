<template>
  <header class="page-header">
    <div class="container">
      <div class="header-content">
        <NuxtLink to="/" class="logo">
          Smilegate® Vietnam
        </NuxtLink>
        
        <nav class="nav-menu">
          <NuxtLink to="/" :class="{ active: $route.path === '/' }">
            <i class="pi pi-home mr-2"></i>
            Game List
          </NuxtLink>
          <NuxtLink to="/register/new" :class="{ active: $route.path === '/register/new' }">
            <i class="pi pi-plus mr-2"></i>
            New Game
          </NuxtLink>
          <NuxtLink to="/register" :class="{ active: $route.path.startsWith('/register') && $route.path !== '/register/new' }">
            <i class="pi pi-cog mr-2"></i>
            Manage Games
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
// No script needed
</script>