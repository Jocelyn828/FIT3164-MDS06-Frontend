<script setup>
import Image from "primevue/image";
import { useToast } from "primevue";
import SearchingPic from "@/assets/searchingpic.svg"; 
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchQuery = ref("");
const toast = useToast();

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
  toast.add({severity: 'error', summary: 'Missing Query', detail: 'Please enter your research query!', life: 3000,}); return;} // prevent empty search
  // Navigate to the ResultsPage with the search query
  router.push({ name: "loading", query: { q: searchQuery.value } });
};

</script>

<template>
  <div class="container">
    <!-- Image Section -->
    <div class="image-container">
      <Image :src="SearchingPic" width="160" />
    </div>

    <!-- Content Section -->
    <div class="text-container">
      <h1 class="title">Get perfect articles in seconds.</h1>
      <div class="input-container">
        <InputText v-model="searchQuery" type="text" size="large" placeholder="Type a research topic or question..."
          class="input-field" @keydown.enter="handleSearch" />
        <Button label="" icon="pi pi-search" iconPos="top" class="search-button" severity="secondary" text  @click="handleSearch" />
      </div>
    </div>
  </div>

  <Toast/>
</template>

<style>
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
  /* width:100%; */
  max-width: 1000px;
  height: 100%;   
  margin: 0 auto; 
  padding: 150px 20px;
  box-sizing: border-box;
}

.image-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.text-container {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.title {
  font-size: 35px;
  font-weight: bold;
}

.input-container {
  position: relative;
  width: 100%;
  max-width: 550px;
  margin: 0;
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
