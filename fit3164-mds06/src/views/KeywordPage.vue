<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";

const keywordsResults = ref([]); // Placeholder for now (no back-end yet)
const router = useRouter();
const route = useRoute();

const continueSearch = () => {
  const query = route.query.q
  router.push({ name: 'loading', query: { q: query } })
};

const goBack = () => {
  router.push({ name: "search" });
};

const buttonLabels = ['Keyword 1', 'Keyword 2', 'Keyword 3', 'Keyword 4', 
'Keyword 5', 'Keyword 6', 'Keyword 7', 'Keyword 8', 'Keyword 9', 'Keyword 10', 'Keyword 11', 'Keyword 12'];
</script>

<template>
  <div class="keyword-wrapper">
    <div class="back-link" @click="goBack">
        <i class="pi pi-chevron-left"></i> Back to Search 
    </div>

    <div class="keyword-container">
      <div class="keyword-text">
          <h1>Select Relevant Keywords</h1>
          <h2>These selections will help us refine your query and deliver more accurate results.</h2>
      </div>

      <div class="keyword-grid">
        <Button v-for="(label, index) in buttonLabels" :key="index" :label="label" class="p-button-outlined p-button-secondary" />
      </div>
    </div>

    <div class="continue-container">
      <Button class="continue-button" label="Continue" icon="pi pi-arrow-right" iconPos="right" @click="continueSearch" />
    </div>
  </div> 
</template>

<style>
.keyword-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; 
  padding: 30px 20px; 
  box-sizing: border-box;
}

.back-link {
  align-self: flex-start;
  font-size: 16px;
  cursor: pointer;
  color: #000;
  font-weight: 500;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: 220px;
  transition: color 0.3s ease, font-weight 0.3s ease;
}

.back-link:hover {
  color: #6c2bd9;
  font-weight: 600;
  text-decoration: none;
}

.keyword-container {
  position: relative;
  width: 100%;
  max-width: 1000px; 
}

.keyword-text h1 {
  font-size: 40px;
  font-weight: bold;
  line-height: 1;
  color: #000;
  margin: 0;
  white-space: normal;
  width: auto;
  text-align: left;
}

.keyword-text h2 {
  font-size: 18px;
  font-weight: lighter;
  line-height: 1.4;
  color: #000;
  margin: 20;
  white-space: normal;
  width: auto;
  text-align: left;
}

.continue-container {
  display: flex;
  margin-bottom: 40px;
  align-items: center;
  margin-top: 20px;
  margin-right: 220px;
  align-self: flex-end;
  gap: 10px;
}

.continue-button {
  background-color: black; 
  color: white; 
  font-size: 15px;           
  top: 20px;
  bottom: 30px;
  padding: 10px;
}

.keyword-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px;
}
</style>
