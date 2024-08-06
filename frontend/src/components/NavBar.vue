<template>
  <div class="container max-w-6xl px-4 flex justify-between mx-auto py-4 items-center">
    <div>
      <RouterLink to="/"><img src="./logo/logo.png" alt="logo" class="w-24"></RouterLink>
    </div>
    <div class="space-x-4">
      <RouterLink to="/edit" v-if="authStore.isAdmin() === 'admin'">Edit</RouterLink>
      <RouterLink to="/register" v-if="!authStore.isLoggedIn">Register</RouterLink>
      <RouterLink to="/login" v-if="!authStore.isLoggedIn">Login</RouterLink>
      <RouterLink to="/profile" v-if="authStore.isLoggedIn"><img style="width: 40px;display: inline;border-radius: 50%;height: 40px;object-fit: cover;" ref="prof"></RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store';
import { ref, onMounted } from 'vue';
import { RouterLink } from "vue-router";

const prof = ref(null)
const authStore = useAuthStore()

onMounted(async ()=>{
  authStore.expiredToken()
  if(authStore.isLoggedIn){
    const response = await fetch("http://localhost:3000/user", {
      method : "GET",
      headers : {
        "Authorization" : authStore.token
      }
    })
    const pp = await response.json()
    prof.value.src = pp.pic
  }
})
</script>