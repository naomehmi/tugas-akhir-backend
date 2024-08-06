<template>
  <div class="mx-auto max-w-6xl px-4">
    <h1 class="font-bold text-2xl mb-3">Register</h1>
    <div>Username</div>
    <input type="text" id="uname" name="username" ref="uname">
    <div>Password</div>
    <input type="password" id="pass" name="password" ref="pass">
    <div id="message" class="pt-3 text-red-600">{{ msg }}</div> 
    <button class="mt-3" @click.prevent="register">register</button>
  </div>
</template>

<script  setup>
import { Buffer } from 'buffer';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

let  msg = ref(null)

const register = async() => {
  const uname = ref(document.getElementById("uname").value)
  const pass = ref(document.getElementById("pass").value)

  const response = await fetch('http://localhost:3000/register',{
    method: "POST",
    headers:{
      "Authorization" : Buffer.from(`${uname.value}:${pass.value}`, 'utf8').toString('base64')  
    },
  })
  const data = await response.json()

  msg.value = data.message

  if(msg.value === "Account has been successfully created"){
    router.push('/login')
  }
}
</script>
