<template>
  <div>
    <div>Username</div>
    <input type="text" id="uname" name="username" ref="uname">
    <div>Password</div>
    <input type="password" id="pass" name="password" ref="pass">
    <div>{{ msg }}</div> 
    <button @click.prevent="register">register</button>
  </div>
</template>

<script  setup>
import { Buffer } from 'buffer';
import { ref } from 'vue';

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
}
</script>
