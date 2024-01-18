<template>
  <div>
    <img id="pp" ref="pp" style="width: 100px;">
    <div id="profile" ref="profile" src=""></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

onMounted(async ()=>{

  let profile = ref(document.getElementById('profile'))
  let pp = ref(document.getElementById('pp'))
  
  const response = await fetch('http://localhost:3000/user', {
    method : 'GET',
    credentials : "include"
  })
  
  const userData = await response.json()
  if('name' in userData){
    const { name, pic } = userData
    profile.value.innerHTML = `<div>Name : ${name}</div>`
    pp.value.src = pic
  } else{
    profile.value.innerText = userData.msg
  }
})


</script>