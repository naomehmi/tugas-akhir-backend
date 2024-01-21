<template>
  <div class="mt-8 container max-w-6xl px-4 mx-auto">
    <table id="allItems">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Category</th>
        <th>Image</th>
      </tr>
    </table>
    <button @click="goToUpload">Upload Product</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store";
import { useRouter } from "vue-router";

const goToUpload = () => {
  router.push("/upload");
};

const authStore = useAuthStore();
const router = useRouter();

const allIds = [];

onMounted(async () => {
  authStore.expiredToken();
  const test = await fetch("http://localhost:3000/", {
    method: "GET",
    headers: {
      Authorization: authStore.token,
    },
  });
  const response = await test.json();
  const allItems = ref(document.getElementById("allItems"));
  response.forEach((element) => {
    allItems.value.innerHTML += `<tr id="${element.id}"><td>${
      element.id
    }</td><td>${element.name}</td><td>${
      element.category === 1 ? "Food" : "Drink"
    }</td><td><img class="w-24" src="..\\..\\public\\uploads\\products\\${
      element.photo
    }"></td><td><button class="edit">Edit Product</button></td>
    <td><button class="del bg-red-600">Delete Product</button></tr>`;
    allIds.push(element.id);
  });

  const editButtons = document.getElementsByClassName("edit");
  const delButtons = document.getElementsByClassName("del");

  for (let i = 0; i < editButtons.length; i++) {
    editButtons[i].addEventListener("click", () => {
      router.push("/change/" + allIds[i]);
    });
  }

  for (let i = 0; i < delButtons.length; i++) {
    delButtons[i].addEventListener("click", async () => {
      await fetch("http://localhost:3000/delete", {
        method: "DELETE",
        headers: {
          "Authorization": authStore.token,
          "Content-Type" : "application/json"
        },
        body : `{"id" : "${allIds[i]}"}`
      });

      router.go(0);
    });
  }
});
</script>
