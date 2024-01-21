<template>
  <form
    @submit.prevent="submitted"
    enctype="multipart/form-data"
    class="container max-w-6xl px-4 mx-auto mt-8"
  >
    <div class="space-y-2 mb-4">
      <div>
        <label for="prodName">Product Name</label>
        <input type="text" id="prodName" required />
      </div>
      <div>
        <label for="prodCat">Product Category</label>
        <select cat="prodCat" id="prodCat" required>
          <option value="food">Food</option>
          <option value="drink">Drink</option>
        </select>
      </div>
      <div>
        <label for="prodPrice">Product Price</label>
        <input type="number" name="prodPrice" id="prodPrice" required />
      </div>
      <div>
        <label for="item_file">Upload product image</label>
        <input
          id="photo"
          type="file"
          name="item_file"
          accept="image/*"
          required
        />
      </div>
    </div>
    <div>
      <input type="submit" value="Upload" />
    </div>
  </form>
  <div id="msg" ref="result"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/store";
import { useRouter } from "vue-router";

const router = useRouter();

const result = ref(document.getElementById("msg"));

const authStore = useAuthStore();

onMounted(() => {
  authStore.expiredToken();
});

const submitted = async () => {
  const ImageData = new FormData();
  const item_file = document.getElementById("photo");

  ImageData.append("item_file", item_file.files["0"]);
  
  const photoResponse = await fetch("http://localhost:3000/product_photo", {
    method: "POST",
    headers : {
      "Authorization" : authStore.token
    },
    body: ImageData,
  });

  console.log(photoResponse)
  const res1 = await photoResponse.json();
  
  result.value.innerText = res1.msg;

  const formData = new FormData();

  formData.append("prodCat", document.getElementById("prodCat").value);
  formData.append("prodName", document.getElementById("prodName").value);
  formData.append("prodPrice", document.getElementById("prodPrice").value);
  formData.append("photoPath", res1.newPath);

  const otherResponse = await fetch("http://localhost:3000/add_products", {
    headers : {
      "Authorization" : authStore.token
    },
    method: "POST",
    body: formData,
  });

  const res2 = await otherResponse.json()

  result.value.innerText = res2.msg;

  if(!photoResponse.ok || !otherResponse.ok) return

  router.push('/')

};
</script>
