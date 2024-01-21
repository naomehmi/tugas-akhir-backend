import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("acc") || "",
  }),
  getters: {
    isLoggedIn: (state) => state.token != "",
  },
  actions: {
    setToken(t) {
      this.token = t;
      localStorage.setItem("acc", t);
    },
    removeToken() {
      this.token = "";
      localStorage.removeItem("acc");
    },
    decodeToken() {
      if (this.token) {
        const base64 = this.token.split(".")[1];
        // const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        return jsonPayload;
      }
    },
    expiredToken() {  
      if(this.token){
        const dateNow = new Date();
        const miliseconds = dateNow.getTime() / 1000;
        let jsonPayload = this.decodeToken();
        jsonPayload = JSON.parse(jsonPayload);
        if (jsonPayload.exp < miliseconds) {
          localStorage.removeItem("acc");
          this.token = "";
          this.role = "user";
        }
      }
    },
    isAdmin() {
      if (this.token) {
        let jsonPayload = this.decodeToken();
        jsonPayload = JSON.parse(jsonPayload);
        return jsonPayload.role
      }
      return "user"
    },
  },
});
