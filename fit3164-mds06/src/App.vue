<script setup>
  import { ref } from "vue";
  import Image from "primevue/image";
  import SearchingPic from "@/assets/searchingpic.svg"; // Import the image
</script>

<template>
  <div class="wrapper">
    <!-- Image Section -->
    <div class="image-container">
      <Image :src="SearchingPic" width="200"/>
    </div>

    <!-- Input Section -->
    <div class="text-container">
      <h1>Get perfect articles in seconds.</h1>
      <div class="input-container">
        <InputText 
          v-model="value3" 
          type="text" 
          size="large"
          placeholder="Type a research topic or question..."
          class="input-field" 
        />
        <Button 
          label="" 
          icon="pi pi-search" 
          iconPos="top" 
          class="search-button" 
          severity="secondary" 
          text
        />
      </div>
    </div>
  </div>
</template>

<style>
html, body {
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper {
  display: flex;
  align-items: center; /* Vertically align items */
  justify-content: center; /* Center content */
  gap: 40px; /* Space between image and text */
  max-width: 1000px; /* Adjust width */
  padding: 0px;
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
  position: relative; /* Allows absolute positioning for the button */
  width: 100%;
}

.input-field {
  width: 100%;
  padding: 12px 50px 12px 15px;
  font-size: 16px;
  border-radius: 25px; /* More rounded edges */
  font-size: 16px;
}

.input-field:focus {
  border-color: #9D34DA; /* Change the green line to blue */
  box-shadow: 0 0 8px #853ab0; /* Optional glowing effect */
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
  border: none;
  cursor: pointer;
}

.search-button:hover {
  border-radius: 100px;
}
</style>
