<script>
import "./index.css"
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import {RouterView} from "vue-router"

export default {
  components: {
    NavBar,
    Footer
  }
}
</script>

<template>
  <NavBar></NavBar>
  <RouterView></RouterView>
  <Footer></Footer>
</template>