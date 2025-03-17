<script setup>
import Image from "primevue/image";
import ResultsPic from "@/assets/resultspic.svg"; 
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { ref } from "vue";
const searchResults = ref([]); // Placeholder for now (no back-end yet)
</script>

<template>
    <div class="results-wrapper">
        <!-- Image Section -->
        <div class="results-image-container"> 
            <Image :src="ResultsPic" alt="Results Image" width=180 />
        </div>

        <!-- Grey Box Content -->
        <div class="results-container">

            <!-- Query Section-->
            <div class="results-content">
            <h2 class="query-title">Your Query:</h2>
            <p class="query-text">(User Input Query)</p>
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
</template>

<style>
html, body {
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Wrapper to contain everything */
.results-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align children to the left */
  width: 100%; /* Take full width of the parent */
  max-width: 1000px; 
  margin-top: 20px; /* Add space from top */
  padding: 0 20px; 
}

/* Container for the image */
.results-image-container {
  margin-bottom: 0px; /* Space between image and grey box */
  width: 100%; 
  display: flex;
  justify-content: flex-start;
}

/* Grey box*/
.results-container {
  background-color: #f0f0f0; 
  padding: 30px;
  border-radius: 10px;
  width: 100%;
  min-height: 500px;
  /* margin: auto; */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
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
  font-size: 16px; 
  color: #555; 
}

/* Table styling */
.results-table {
  width: 100%;
  margin-top: 20px;
}

</style>