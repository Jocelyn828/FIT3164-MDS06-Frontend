<script setup>
import Image from "primevue/image";
import ResultsPic from "@/assets/resultspic.svg";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/services/queryRefinement";

const route = useRoute();
const router = useRouter();

const query = ref(route.query.q || "");
const searchResults = ref([]);
const refinedQuery = ref("");
const keyConceptsText = ref("");
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  if (!query.value) {
    router.push({ name: "search" });
    return;
  }
  
  try {
    loading.value = true;
    
    const data = await api.searchArticles(query.value);
    
    refinedQuery.value = data.refined_query;
    keyConceptsText.value = data.key_concepts.join(", ");
    
    searchResults.value = data.articles.map(article => ({
      title: article.title,
      author: "N/A", 
      year: "N/A", 
      source: article.source,
      num_citations: "N/A", 
      keywords: article.theme || "N/A",
      citation: article.url || "N/A", 
      abstract: article.abstract_preview,
      similarity_score: article.similarity_score.toFixed(2)
    }));
    
  } catch (err) {
    console.error('Error fetching search results:', err);
    error.value = "Failed to load search results. Please try again.";
  } finally {
    loading.value = false;
  }
});

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
      <img :src="ResultsPic" alt="Results Image" class="floating-image" />
      
      <div class="results-container">
        <div v-if="loading" class="loading-state">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: #9D34DA;"></i>
          <p>Searching for articles...</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <Button @click="goBack" label="Try Again" class="p-button-secondary" />
        </div>
        
        <div v-else class="results-content">
          <div class="query-section">
            <h2 class="query-title">Your Query:</h2>
            <p class="query-text">{{ query }}</p>
            
            <h2 class="query-title">Refined Query:</h2>
            <p class="query-text">{{ refinedQuery }}</p>
            
            <h2 class="query-title">Key Concepts:</h2>
            <p class="query-text">{{ keyConceptsText }}</p>
          </div>
          
          <DataTable 
            :value="searchResults" 
            class="results-table" 
            :paginator="searchResults.length > 10" 
            :rows="10"
            stripedRows
            tableStyle="min-width: 50rem"
          >
            <Column field="title" header="Title"></Column>
            <Column field="source" header="Source"></Column>
            <Column field="keywords" header="Keywords"></Column>
            <Column field="similarity_score" header="Relevance"></Column>
            <Column header="Actions">
              <template #body="slotProps">
                <a :href="slotProps.data.citation" target="_blank" class="action-button">
                  <i class="pi pi-external-link"></i>
                </a>
              </template>
            </Column>
          </DataTable>
          
          <div v-if="searchResults.length === 0" class="no-results">
            <p>No articles found matching your query.</p>
          </div>
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
  padding: 40px 20px;
  background-color: #f8f9fa;
  min-height: 80vh;
}

.back-link {
  align-self: flex-start;
  font-size: 16px;
  cursor: pointer;
  color: #555;
  font-weight: 500;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 110px;
  transition: all 0.3s ease;
}

.back-link:hover {
  color: #9D34DA;
  transform: translateX(-3px);
}

.container-with-floating-image {
  position: relative;
  width: 100%;
  max-width: 1200px;
}

.floating-image {
  position: absolute;
  top: -80px;  
  left: -40px;    
  z-index: 2;
  width: 180px;
  height: auto;
  filter: drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.15));
}

.results-container {
  background-color: white;
  padding: 40px;
  border-radius: 1.5rem;
  margin-top: 60px;
  min-height: 300px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
}

.results-content {
  text-align: left;
  width: 100%;
}

.query-section {
  background-color: #f9f5fd;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  border-left: 4px solid #9D34DA;
}

.query-title {
  margin: 10px 0 5px 0; 
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.query-text {
  margin: 0 0 15px 0; 
  font-size: 16px;
  color: #555;
  line-height: 1.5;
}

.query-text:last-child {
  margin-bottom: 0;
}

.results-table {
  width: 100%;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.results-table .p-datatable-header {
  background-color: #f1e6f9;
}

.results-table .p-datatable-thead > tr > th {
  background-color: #f1e6f9;
  color: #333;
  font-weight: 600;
}

.results-table .p-datatable-tbody > tr:nth-child(even) {
  background-color: #fcfaff;
}

.action-button {
  color: #9D34DA;
  background-color: #f1e6f9;
  padding: 8px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: #9D34DA;
  color: white;
  transform: translateY(-2px);
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  width: 100%;
  gap: 15px;
}

.loading-state p, .error-state p {
  color: #6c757d;
  font-size: 1.1rem;
}

.no-results {
  text-align: center;
  margin: 40px 0;
  padding: 30px;
  background-color: #f9f5fd;
  border-radius: 12px;
  color: #6c757d;
}

@media (max-width: 992px) {
  .back-link {
    margin-left: 10px;
  }
  
  .floating-image {
    width: 140px;
    top: -60px;
    left: -20px;
  }
  
  .results-container {
    padding: 30px;
    margin-top: 40px;
  }
}

@media (max-width: 576px) {
  .results-wrapper {
    padding: 20px 10px;
  }
  
  .floating-image {
    width: 100px;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .results-container {
    padding: 20px;
    margin-top: 30px;
  }
  
  .query-title {
    font-size: 16px;
  }
  
  .query-text {
    font-size: 14px;
  }
}
</style>