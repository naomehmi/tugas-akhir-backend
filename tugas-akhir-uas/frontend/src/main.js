import "./index.css"
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Home from "./pages/Home.vue";
import Register from "./pages/Register.vue";
import Login from "./pages/Login.vue";
import Profile from "./pages/Profile.vue";
import UploadProduct from "./pages/UploadProduct.vue";
import EditProducts from "./pages/EditProducts.vue";
import ChangeProduct from "./pages/ChangeProduct.vue";
import { useAuthStore } from "./store";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);

const routes = [
  { path: "/", component: Home },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  { path: "/profile", component: Profile },
  { path: "/upload", component: UploadProduct },
  { path: "/edit", component: EditProducts },
  { path: "/change/:id", component: ChangeProduct, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const authStore = useAuthStore();
router.beforeEach((to, from) => {
  if ((to.fullPath === "/login" || to.fullPath === "/register") && authStore.isLoggedIn) {
    return "/";
  } else {
    return true;
  }
});

app.use(router);
app.mount("#app");
