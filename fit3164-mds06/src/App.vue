<script setup>
  import { ref } from "vue";
</script>

<template>
  <div class="container">
    <h1>Get perfect articles in seconds.</h1>

    <div class="input-container">
      <InputText v-model="value3" type="text" size="large"
        placeholder="Type a research topic or question..."
        class="input-field" />
      <Button label="" icon="pi pi-search" iconPos="top" class="search-button" severity="secondary" text/>
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

.container {
  width: 100%;
  max-width: 600px;
  text-align: center;
  padding: 20px;
}

.input-container {
  position: relative; /* Allows absolute positioning for the button */
  width: 100%;
}

.input-field {
  width: 100%;
  padding: 12px 50px 12px 15px; /* Space for button on the right */
  font-size: 16px;
}

.search-button {
  position: absolute;
  top: 50%;
  right: 10px; /* Adjust position */
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
  background-color: #e3e6e9;
}
</style>
