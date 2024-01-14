<template>
  <div>
    <div>Username</div>
    <input type="text" id="uname" name="username" ref="uname">
    <div>Password</div>
    <input type="text" id="pass" name="password" ref="pass">
    <div>{{ msg }}</div> 
    <button @click.prevent="login">login</button>
  </div>
</template>

<script setup>
import { Buffer } from 'buffer';
import { ref } from 'vue';

let msg = ref(null)

const login = async ()=>{
  const uname = ref(document.getElementById("uname").value)
  const pass = ref(document.getElementById("pass").value)

  const response = await fetch('http://localhost:3000/login', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization" : Buffer.from(`${uname.value}:${pass.value}`, 'utf8').toString('base64')  
    },
  })
  const data = await response.json()
  msg.value = data.message
}
</script>
