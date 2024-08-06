<template>
  <div ref="show" id="show"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store";

const router = useRouter()
const authStore = useAuthStore()
const props = defineProps({
  id: String,
});

const show = ref(document.getElementById("show"));

const submitName = async ()=>{
  const newName = document.getElementById("newName").value

  await fetch("http://localhost:3000/name-change", {
    method : "POST",
    headers: {
      "Authorization" : authStore.token,
      "Content-Type" : "application/json"
    },
    body : `{"newName" : "${newName}", "id" : "${props.id}"}`
  })
  router.go(0)
}

const submitCategory = async()=>{
  const newCategory = document.getElementById("newCategory").value

  await fetch("http://localhost:3000/category-change", {
    method : "POST",
    headers : {
      "Authorization" : authStore.token,
      "Content-Type" : "application/json"
    },
    body: `{"newCategory" : "${newCategory}", "id" : "${props.id}"}`
  })
  router.go(0)
}

const submitPhoto = async()=>{
  const newPic = document.getElementById("newPic")
  const formData = new FormData()
  formData.append("newPic", newPic.files[0])

  await fetch("http://localhost:3000/photo-change/" + props.id, {
    method : "POST",
    headers : {
      "Authorization" : authStore.token,
    },
    body : formData
  })
  router.go(0)
}

onMounted(async () => {
  console.log(props.id)
  const response = await fetch("http://localhost:3000/prod/" + props.id, {
    method: "GET",
    headers: {
      "Authorization" : authStore.token,
      "Content-Type" : "application/json"
    },
  });
  const prod = await response.json();
  show.value.innerHTML = `
    <table>
      <tr>
        <th>Field</th>
        <th>Current Values</th>
        <th>New Values</th>  
      </tr>
      <tr>
        
          <td>Product Name</td>
          <td>${prod.name}</td>
          <form>
            <td><input id="newName" type="text" name="newName" required></td>
            <td><input id="submitName" type="submit" value="Apply Changes"></td>
          </form>
      </tr>
      <tr>
          <td>Product Category</td>
          <td>${prod.category === 1 ? "Food" : "Drink"}</td>
          <form>
            <td><select name="newCategory" id="newCategory" required>
              <option value="food">Food</option>
              <option value="drink">Drink</option>
              </select></td>
              <td><input id="submitCategory" type="submit" value="Apply Changes"></td>
          <form>
      </tr>
      <tr>
          <td>Product Image</td>
          <td><img class="w-64" src="..\\..\\public\\uploads\\products\\${
      prod.photo
    }"></td>
    <form enctype="multipart/form-data">
          <td><input
          id="newPic"
          type="file"
          name="newPic"
          accept="image/*"
          required
        /></td>
          <td><input id="submitPhoto" type="submit" value="Apply Changes"></td>
    </form>
      </tr>
    </table>
  `;

  document.getElementById("submitName").addEventListener("click", ()=>{
    submitName()
  })

  document.getElementById("submitCategory").addEventListener("click", ()=>{
    submitCategory()
  })

  document.getElementById("submitPhoto").addEventListener("click", ()=>{
    submitPhoto()
  })
});
</script>
