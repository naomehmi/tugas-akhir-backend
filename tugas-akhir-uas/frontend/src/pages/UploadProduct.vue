<template>
  <form @submit.prevent="submitted" enctype="multipart/form-data">
    <div>
      <label for="prodName">Product Name</label>
      <input type="text" id="prodName" required>
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
      <input type="number" name="prodPrice" id="prodPrice" required>
    </div>
    <div>
      <label for="item_file">Upload product image</label>
      <input id="photo" type="file" name="item_file" accept="image/*" required />
    </div>
    <div>
      <input type="submit" value="Upload" />
    </div>
  </form>
  <div id="msg" ref="result"></div>
</template>

<script setup>
import { ref } from "vue";
const result = ref(document.getElementById("msg"));

const submitted = async () => {
  const formData = new FormData();
  const item_file = document.getElementById("photo");
  
  formData.append("prodCat", document.getElementById("prodCat").value);
  formData.append("prodName", document.getElementById('prodName').value);
  formData.append("prodPrice", document.getElementById('prodPrice').value);
  formData.append("photoPath", item_file.files["0"].name)
  
  const addProduct = await fetch("http://localhost:3000/add_products",{
    method: "POST",
    body: formData
  })
  
  const ImageData = new FormData();
  ImageData.append("item_file", item_file.files["0"]);

  const photoResponse = await fetch("http://localhost:3000/product_photo", {
    method: "POST",
    body: ImageData,
  });

  const res = await photoResponse.json();
  result.value.innerText = res

};
</script>
