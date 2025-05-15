<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import keywordService from "../services/keywordExpansion.js"; 

const toast = useToast();
const router = useRouter();
const route = useRoute();

// Get the original query from route
const originalQuery = computed(() => route.query.q || "");

// State for selected keywords
const selectedKeywords = ref([]);

// Keywords from API
const keywordSuggestions = ref([]);

// Loading state
const isLoading = ref(false);

// Fetch keyword suggestions based on the query
onMounted(async () => {
  if (!originalQuery.value) {
    router.push({ name: "search" });
    return;
  }
  
  // Show loading state
  isLoading.value = true;
  
  try {
    // Fetch keywords from the API
    const response = await keywordService.generateKeywords(originalQuery.value);
    
    if (response.success && response.keywords && response.keywords.length > 0) {
      keywordSuggestions.value = response.keywords;
    } else {
      // If no keywords returned or error, show a toast and use fallback keywords
      toast.add({
        severity: 'warn',
        summary: 'Notice',
        detail: 'Could not generate specific keywords. Using general terms instead.',
        life: 3000
      });
      
      // Use fallback keywords similar to your mock function
      const fallbackKeywords = [
        "Research", "Studies", "Analysis", "Review", "Methods",
        "Data", "Results", "Effects", "Impact", "Applications",
        "Theory", "Framework", "Model", "System", "Approach"
      ];
      keywordSuggestions.value = fallbackKeywords;
    }
  } catch (error) {
    console.error("Error fetching keyword suggestions:", error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load keyword suggestions',
      life: 3000
    });
    
    // Use fallback keywords
    const fallbackKeywords = [
      "Research", "Studies", "Analysis", "Review", "Methods",
      "Data", "Results", "Effects", "Impact", "Applications",
      "Theory", "Framework", "Model", "System", "Approach"
    ];
    keywordSuggestions.value = fallbackKeywords;
  } finally {
    isLoading.value = false;
  }
});

// Toggle keyword selection
const toggleKeyword = (keyword) => {
  const index = selectedKeywords.value.indexOf(keyword);
  if (index > -1) {
    selectedKeywords.value.splice(index, 1);
  } else {
    selectedKeywords.value.push(keyword);
  }
};

// Build the enhanced query with boolean operators
const buildBooleanQuery = () => {
  if (selectedKeywords.value.length === 0) {
    return originalQuery.value;
  }
  
  // Add selected keywords with OR between them and parentheses
  const keywordPart = selectedKeywords.value.map(kw => `"${kw}"`).join(" OR ");
  
  // Combine original query with selected keywords using AND operator
  return `(${originalQuery.value}) AND (${keywordPart})`;
};

// Continue to exclusion page with the enhanced query
const continueSearch = () => {
  // Build the enhanced query using the selected keywords
  const enhancedQuery = buildBooleanQuery();
  
  // Show success toast if keywords were selected
  if (selectedKeywords.value.length > 0) {
    toast.add({
      severity: 'success',
      summary: 'Search Enhanced',
      detail: `Added ${selectedKeywords.value.length} keywords to your search`,
      life: 3000
    });
  }
  
  // Navigate to exclusion page instead of results
  router.push({ 
    name: 'exclusion', 
    query: { 
      q: enhancedQuery,  // This is the boolean query with operators
      originalQuery: originalQuery.value,
      keywords: selectedKeywords.value.join(',')
    } 
  });
};

// Navigate back to search
const goBack = () => {
  router.push({ name: "search" });
};
</script>

<template>
  <div class="keyword-wrapper">
    <div class="top-navigation">
      <button class="back-button" @click="goBack">
        <i class="pi pi-chevron-left"></i> 
        <span>Back to Search</span>
      </button>
    </div>
    
    <div class="keyword-container">
      <div class="keyword-text">
        <h1>Select Relevant Keywords</h1>
        <h2>These selections will help us refine your query and deliver more accurate results.</h2>
        <p class="original-query">
          <span class="query-label">Original Query:</span> 
          <span class="query-text">{{ originalQuery }}</span>
        </p>
      </div>
      
      <div v-if="isLoading" class="loading-container">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <p>Generating relevant keywords...</p>
      </div>
      
      <div v-else class="keyword-grid">
        <Button 
          v-for="keyword in keywordSuggestions" 
          :key="keyword" 
          :label="keyword" 
          :class="[
            'p-button-outlined',
            selectedKeywords.includes(keyword) ? 'p-button-primary' : 'p-button-secondary'
          ]"
          @click="toggleKeyword(keyword)"
        />
      </div>
      
      <div class="selected-keywords" v-if="selectedKeywords.length > 0">
        <h3>
          <i class="pi pi-check-circle"></i>
          {{ selectedKeywords.length }} keyword{{ selectedKeywords.length > 1 ? 's' : '' }} selected
        </h3>
        <div class="selected-tags">
          <span v-for="keyword in selectedKeywords" :key="`selected-${keyword}`" class="selected-tag">
            {{ keyword }}
            <i class="pi pi-times" @click="toggleKeyword(keyword)"></i>
          </span>
        </div>
      </div>
      
      <div class="button-container">
        <Button 
          class="skip-button" 
          label="Skip" 
          icon="pi pi-arrow-right" 
          iconPos="right" 
          severity="secondary"
          outlined
          @click="() => router.push({ 
            name: 'exclusion', 
            query: { 
              q: originalQuery, 
              originalQuery: originalQuery 
            } 
          })" 
        />
        <Button 
          class="apply-button" 
          label="Apply Keywords" 
          icon="pi pi-check" 
          iconPos="right" 
          :disabled="selectedKeywords.length === 0"
          @click="continueSearch" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.keyword-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 30px 20px;
  box-sizing: border-box;
  min-height: 80vh;
}

.top-navigation {
  width: 100%;
  max-width: 1000px;
  margin-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  background: none;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #495057;
  font-weight: 500;
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: #f8f9fa;
  color: #9D34DA;
}

.back-button i {
  font-size: 14px;
}

.keyword-container {
  position: relative;
  width: 100%;
  max-width: 1000px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  padding: 32px;
}

.keyword-text h1 {
  font-size: 28px;
  font-weight: bold;
  line-height: 1.2;
  color: #9D34DA;
  margin: 0 0 16px 0;
  text-align: left;
}

.keyword-text h2 {
  font-size: 16px;
  font-weight: normal;
  line-height: 1.4;
  color: #6c757d;
  margin: 0 0 24px 0;
  text-align: left;
}

.original-query {
  background-color: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  border-left: 4px solid #9D34DA;
}

.query-label {
  font-weight: 600;
  color: #212529;
  margin-right: 8px;
}

.query-text {
  color: #495057;
  font-weight: 500;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #6c757d;
}

.keyword-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.keyword-grid .p-button {
  width: 100%;
  justify-content: flex-start;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  border-color: #dee2e6;
  color: #495057;
}

.keyword-grid .p-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.keyword-grid .p-button.p-button-primary {
  background-color: #f1e6f9;
  border-color: #9D34DA;
  color: #9D34DA;
  font-weight: 600;
}

.selected-keywords {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.selected-keywords h3 {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.selected-keywords h3 i {
  color: #9D34DA;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #f1e6f9;
  color: #9D34DA;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
}

.selected-tag i {
  cursor: pointer;
  font-size: 12px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(157, 52, 218, 0.1);
  transition: background-color 0.2s ease;
}

.selected-tag i:hover {
  background-color: rgba(157, 52, 218, 0.2);
}

.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.skip-button {
  color: #495057;
  border-color: #dee2e6;
  font-weight: 500;
  padding: 10px 20px;
}

.skip-button:hover {
  background-color: #f8f9fa;
  border-color: #ced4da;
  color: #212529;
}

.apply-button {
  background-color: #9D34DA;
  border-color: #9D34DA;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  min-width: 180px;
}

.apply-button:hover:not(:disabled) {
  background-color: #7209b7;
  border-color: #7209b7;
}

.apply-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .keyword-container {
    padding: 24px 16px;
  }
  
  .keyword-text h1 {
    font-size: 24px;
  }
  
  .keyword-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
  
  .button-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .skip-button, .apply-button {
    width: 100%;
  }
  
  .back-button {
    padding: 8px 12px;
  }
}
</style>