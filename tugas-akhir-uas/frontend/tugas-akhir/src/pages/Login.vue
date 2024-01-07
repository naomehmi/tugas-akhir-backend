<template>
  <div>
    <div>Username</div>
    <input type="text" name="username" id="uname" ref="username">
    <div>Password</div>
    <input type="text" name="password" id="pw" ref="password">
    <div>{{ msg }}</div> 
    <button @click.prevent="login()">login</button>
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
  methods : {
    async login(){
      this.uname = this.$refs.username.value
      this.pass = this.$refs.password.value
    }
  }
}
</script>