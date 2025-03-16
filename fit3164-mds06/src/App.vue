<script setup>
import Image from "primevue/image";
import SearchingPic from "@/assets/searchingpic.svg"; 
</script>

<template>
  <div class="container">
    <!-- Image Section -->
    <div class="image-container">
      <Image :src="SearchingPic" width="160" />
    </div>

    <!-- Content Section -->
    <div class="text-container">
      <h1>Get perfect articles in seconds.</h1>
      <div class="input-container">
        <InputText v-model="value3" type="text" size="large" placeholder="Type a research topic or question..."
          class="input-field" />
        <Button label="" icon="pi pi-search" iconPos="top" class="search-button" severity="secondary" text />
      </div>
    </div>
  </div>
</template>

<style>
html,
body {
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  max-width: 1000px;
}

.image-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.text-container {
  flex: 3;
  text-align: left;
}

.input-container {
  position: relative;
  width: 100%;
}

.input-field {
  width: 100%;
  padding: 12px 50px 12px 15px;
  font-size: 16px;
  border-radius: 25px;
  background-color: #f7f5f9;
}

.input-field:focus {
  border-color: #9D34DA;
  box-shadow: 0 0 8px #d7b1ed;  /* add glowing effect */
}

.search-button {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  padding: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-button:hover {
  background-color: #fcf7ff;
  border-radius: 50px;
}
</style>
