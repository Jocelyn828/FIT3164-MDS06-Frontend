<script setup>
import Image from "primevue/image";
import ResultsPic from "@/assets/resultspic.svg";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "@/services/queryRefinement";
import { useToast } from "primevue/usetoast";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const originalQuery = ref(route.query.originalQuery || route.query.q || "");
const processedQuery = ref(route.query.q || "");
const searchResults = ref([]);
const refinedQuery = ref("");
const keyConceptsText = ref("");
const loading = ref(true);
const error = ref(null);
const selectedDocuments = ref([]);

onMounted(async () => {
  if (!processedQuery.value) {
    router.push({ name: "search" });
    return;
  }
  
  try {
    loading.value = true;
    
    const data = await api.searchArticles(processedQuery.value);
    
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

const refineSearch = async () => {
  if (selectedDocuments.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'No Documents Selected',
      detail: 'Please select at least one document to exclude.',
      life: 3000
    });
    return;
  }

  try {
    loading.value = true;
    
    // Create exclusion terms from selected documents
    const exclusionTerms = selectedDocuments.value
      .map(doc => `title: "${doc.title}"`)
      .join(' ');
    
    // Add exclusion terms to the query
    const newQuery = `${processedQuery.value} AND NOT (${exclusionTerms})`;
    
    // Perform new search with refined query
    const data = await api.searchArticles(newQuery);
    
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
    
    toast.add({
      severity: 'success',
      summary: 'Search Refined',
      detail: `Excluded ${selectedDocuments.value.length} documents from search results.`,
      life: 3000
    });

    // Clear selection after refinement
    selectedDocuments.value = [];
    
  } catch (err) {
    console.error('Error refining search:', err);
    toast.add({
      severity: 'error',
      summary: 'Refinement Failed',
      detail: 'Failed to refine search results. Please try again.',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

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
            <p class="query-text">{{ originalQuery }}</p>
            
            <h2 class="query-title">Refined Query:</h2>
            <p class="query-text">{{ refinedQuery }}</p>
            
            <h2 class="query-title">Key Concepts:</h2>
            <p class="query-text">{{ keyConceptsText }}</p>
          </div>
          
          <div class="refine-container" v-if="searchResults.length > 0">
            <div class="refine-instructions">
              <i class="pi pi-info-circle"></i>
              <p>Select documents to exclude in order to refine your search results.</p>
            </div>
            <Button 
              @click="refineSearch" 
              :disabled="selectedDocuments.length === 0 || loading"
              :loading="loading"
              class="refine-button"
            >
              <i class="pi pi-filter"></i>
              Refine Search ({{ selectedDocuments.length }} selected)
            </Button>
          </div>
          
          <DataTable 
            :value="searchResults" 
            v-model:selection="selectedDocuments"
            class="results-table" 
            :paginator="searchResults.length > 10" 
            :rows="10"
            stripedRows
            tableStyle="min-width: 50rem"
            dataKey="title"
            :loading="loading"
          >
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
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
  transition: all 0.2s ease;
  padding: 10px 16px;
  border-radius: 8px;
}

.back-link:hover {
  color: #9D34DA;
  transform: translateX(-3px);
  background-color: #f0f2f4;
}

.container-with-floating-image {
  position: relative;
  width: 100%;
  max-width: 1200px;
}

.floating-image {
  position: absolute;
  top: -70px;
  right: 5px;
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

.refine-container {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.refine-instructions {
  display: flex;
  gap: 12px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  flex: 1;
  min-width: 300px;
}

.refine-instructions i {
  color: #9D34DA;
  font-size: 1.2rem;
  margin-top: 2px;
}

.refine-instructions p {
  margin: 0;
  color: #495057;
  line-height: 1.5;
}

.refine-button {
  white-space: nowrap;
  background-color: #9D34DA;
  border-color: #9D34DA;
  color: white;
  font-weight: 600;
  padding: 16px;
}

.refine-button:hover:not(:disabled) {
  background-color: #7209b7;
  border-color: #7209b7;
}

.refine-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 992px) {
  .back-link {
    margin-left: 10px;
  }
  
  .floating-image {
    width: 140px;
    top: -60px;
    right: -20px;
  }
  
  .results-container {
    padding: 30px;
    margin-top: 40px;
  }

  .refine-container {
    flex-direction: column;
    align-items: stretch;
  }

  .refine-instructions {
    min-width: unset;
  }

  .refine-button {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .results-wrapper {
    padding: 20px 10px;
  }
  
  .floating-image {
    width: 100px;
    top: -40px;
    right: 50%;
    transform: translateX(240%);
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

  .refine-container {
    margin-top: 20px;
    gap: 12px;
  }

  .refine-instructions {
    padding: 12px;
  }
}
</style>