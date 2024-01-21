<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const response = ref();

onMounted(async () => {
  authStore.expiredToken();
  const test = await fetch("http://localhost:3000/", {
    method: "GET",
  });
  response.value = await test.json();
  console.log(response.value)
});
</script>

<template>
  <div class="mt-8 grid grid-cols-3 gap-4 container max-w-6xl px-4 mx-auto">
    <div v-for="x in response" class="rounded-lg border-black/15 border p-2">
      <img :src="`..\\..\\public\\uploads\\products\\${x.photo}`" class="rounded-lg" />
      <div class="flex justify-between mt-2 items-center">
        <p class="font-bold">{{ x.name }}</p>
        <p class="text-xs">IDR {{ x.price }}</p>
      </div>
    </div>
  </div>
</template>
