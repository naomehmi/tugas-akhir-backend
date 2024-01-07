<script setup>
import { ref, computed } from 'vue'
import Home from './pages/Home.vue'
import Register from './pages/Register.vue'
import Login from './pages/Login.vue'

const routes = {
  '/' : Home,
  '/register': Register,
  '/login': Login
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/']
})
</script>

<template>
  <a href="#/">Home</a> |
  <a href="#/register">Register</a> |
  <a href="#/login">Login</a>
  <component :is="currentView" />
</template>