<template>
  <div>
    <div>Username</div>
    <input type="text" name="username" id="uname" ref="username">
    <div>Password</div>
    <input type="text" name="password" id="pw" ref="password">
    <div>{{ msg }}</div> 
    <button @click.prevent="register()">register</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uname: '',
      pass:'',
      msg:''
    };
  },
  methods: { 
    async register(){
      this.uname = this.$refs.username.value
      this.pass = this.$refs.password.value

      const response = await fetch('http://localhost:3000/register',{
        method: "POST",
        headers:{
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          "name" : this.uname,
          "password" : this.pass
        })
      })
      const data = await response.json()
      this.msg = data.message
    }
  }
};
</script>