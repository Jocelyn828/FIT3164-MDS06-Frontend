<script setup>
  import { ref } from "vue";

  const searchQuery = ref("");

  const performSearch = () => {
    console.log("Searching for:", searchQuery.value);
  };
</script>

<template>
  <div class="container">
    <h1>Get perfect articles in seconds.</h1>
  </div>
  <div class="flex gap-2">
    <InputText v-model="searchQuery" placeholder="Search..." />
    <Button label="Search" icon="pi pi-search" @click="performSearch" />
  </div>
</template>

<style scoped>
  .container{
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
  .p-inputtext {
  width: 100%;
  max-width: 300px;
  }
</style>
