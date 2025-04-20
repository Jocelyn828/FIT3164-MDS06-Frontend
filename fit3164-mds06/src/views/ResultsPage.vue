<script setup>
import Image from "primevue/image";
import ResultsPic from "@/assets/resultspic.svg"; 
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  query: String, // Accept the search query as a prop
});

const searchResults = ref([]); // Placeholder for now (no back-end yet)
const router = useRouter();

const goBack = () => {
  router.push({ name: "search" });
};

</script>

<template>
    <div class="results-wrapper">

      <div class="back-link" @click="goBack">
        <i class="pi pi-chevron-left"></i> Back to Search 
      </div>

      <div class="container-with-floating-image">
        <!-- Floating image aligned top-left of grey box--> 
          <img :src="ResultsPic" alt="Results Image" class="floating-image" />
          
        <!-- Grey Box Content -->
        <div class="results-container">
            <!-- Query Section-->
            <div class="results-content">
              <h2 class="query-title">Your Query:</h2>
              <p class="query-text">{{ props.query }}</p>
              <h2 class="query-title">Refined Query:</h2>
              <p class="query-text">(Refined Query)</p>
              
              <!-- Table Section -->
              <DataTable :value="searchResults" class="results-table">
                  <Column field="title" header="Title"></Column>
                  <Column field="author" header="Author"></Column>
                  <Column field="year" header="Year"></Column>
                  <Column field="source" header="Source"></Column>
                  <Column field="num_citations" header="No. of Citations"></Column>
                  <Column field="keywords" header="Keywords"></Column>
                  <Column field="citation" header="Citation"></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
</template>

<style>
.results-wrapper {
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

.container-with-floating-image {
  position: relative;
  width: 100%;
  max-width: 1000px; 
}

.floating-image {
  position: absolute;
  top: -20px;  /* lift image above grey box */
  left: 0;     
  z-index: 2;
  width: 160px;
  height: auto;
}

/* Grey box*/
.results-container {
  background-color: #f0f0f0; 
  padding: 30px;
  border-radius: 10px;
  margin-top: 100px;
  /* width: 100%; */
  /* max-width: 1000px; */
  min-height: 300px; 
  /* margin: auto; */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

/* Content inside the box */
.results-content {
  text-align: left;
  width: 100%;
}

/* Styling for query titles and text */
.query-title {
  margin: 0; /* Remove default margin */
  font-size: 18px; 
  font-weight: bold; 
  color: #333; 
}

.query-text {
  margin: 0 0 15px 0; /* Add margin below each query text */
  font-size: 18px; 
  color: #555; 
}

/* Table styling */
.results-table {
  width: 100%;
  margin-top: 20px;
}

</style>