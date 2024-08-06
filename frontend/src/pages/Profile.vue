<template>
  <div class="mx-auto container max-w-6xl px-4 mt-8">
    <img
          id="pp"
          ref="pp"
          class="w-20 h-20 object-cover rounded-full"
          onerror="this.src='../../public/uploads/profile/default.jpg'"
        />
    <div id="profile" ref="profile" src=""></div>
    <div v-if="authStore.isLoggedIn && authStore.isAdmin() !== 'admin'">
      <h2 class="mt-5">Account Settings</h2>
      <div>
        <h3 class="pt-4">Change Username</h3>
        <form @submit.prevent="changeName" class="space-y-2">
          <div>
            <label for="username">New Username : </label>
            <input type="text" id="newName" name="username" />
          </div>
          <input type="submit" value="Change username now" />
        </form>
        <div class="text-red-600">{{ msg1 }}</div>

        <h3>Change Password</h3>
        <form @submit.prevent="changePass" class="space-y-2">
          <div>
            <label for="newPass">New Password: </label>
            <input type="password" name="newPass" id="newPass" />
          </div>
          <div>
            <label for="oldPass">Old Password: </label>
            <input type="password" name="oldPass" id="oldPass" />
          </div>
          <input type="submit" value="Change password now" />
        </form>
        <div class="text-red-600">{{ msg2 }}</div>

        <h3>Profile Picture</h3>
        <form @submit.prevent="changePic" enctype="multipart/form-data">
          <!-- <label for="newProf">New Profile Picture</label> -->
          <input
          id="newProf"
          type="file"
          name="newProf"
          accept="image/*"
          required
          />
          <input type="submit" value="Change profile picture now" />
          <div class="text-red-600">{{ msg3 }}</div>
        </form>
      </div>
    </div>
    <button class="mt-8 bg-red-500 hover:bg-red-700" v-if="authStore.isLoggedIn" @click="logout">logout</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store";
import { Buffer } from "buffer";

const router = useRouter();
const authStore = useAuthStore();
const msg1 = ref(null)
const msg2 = ref(null)
const msg3 = ref(null)

const logout = async () => {
  authStore.removeToken()
  router.push('/');
};

const changeName = async () => {
  const newName = document.getElementById("newName").value

  const response = await fetch("http://localhost:3000/new_name", {
    method : "POST",
    headers : {
      "Authorization" : authStore.token
    },
    body : newName
  })

  const data = await response.json()
  msg1.value = data.msg

  if(response.ok) authStore.setToken(data.updatedToken)

  router.go(0)
};

const changePass = async () => {
  const oldPass = document.getElementById("oldPass").value;
  const newPass = document.getElementById("newPass").value;

  const passChanged = await fetch("http://localhost:3000/new_pass", {
    method: "POST",
    headers : {
      "Authorization" : authStore.token
    },
    body : Buffer.from(`${oldPass}:${newPass}`, 'utf8').toString('base64')
  });

  const data = await passChanged.json()
  if(passChanged.ok) authStore.setToken(data.updatedToken)
  msg2.value = data.msg
  router.go(0)
};

const changePic = async () => {
  const formData = new FormData();
  const newProf = document.getElementById("newProf");
  formData.append("newProf", newProf.files["0"]);

  const photoChanged = await fetch("http://localhost:3000/profile-pic", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: authStore.token,
    },
  });

  const res = await photoChanged.json();
  if(photoChanged.ok) authStore.setToken(res.updatedToken);
  console.log(res);

  msg3.value = data.msg

  router.go(0);
};

onMounted(async () => {
  authStore.expiredToken();
  let profile = ref(document.getElementById("profile"));
  let pp = ref(document.getElementById("pp"));

  const response = await fetch("http://localhost:3000/user", {
    method: "GET",
    credentials: "include",
    headers: {
      authorization: authStore.token,
    },
  });

  const userData = await response.json();
  if ("name" in userData) {
    const { name, pic, role } = userData;
    profile.value.innerHTML = `<div>Name : ${name}</div><div>Role : ${role}</div>`;
    pp.value.src = pic;
  } else {
    profile.value.innerText = userData.msg;
  }
});
</script>
