<script setup>
import Image from "primevue/image";
import { useToast } from "primevue/usetoast";
import SearchingPic from "@/assets/searchingpic.svg";
import { ref } from "vue";
import { useRouter } from "vue-router";
import keywordService from '@/services/keywordService'; 

const router = useRouter();
const searchQuery = ref("");
const toast = useToast();
const isExpanding = ref(false);

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    toast.add({
      severity: 'error', 
      summary: 'Search Query Required', 
      detail: 'Please enter your research topic.', 
      life: 3000
    });
    return;
  }
  router.push({ name: "keyword", query: { q: searchQuery.value } });
};

// Using the keyword service
const handleKeywordClick = async (keyword) => {
  try {
    isExpanding.value = true;
    
    // Use the keyword service to expand the keyword
    const data = await keywordService.expandKeyword(keyword);
    
    if (data.success) {
      // Update the search input with the expanded query
      searchQuery.value = data.expandedQuery;
      
      toast.add({
        severity: 'success',
        summary: 'Keyword Expanded',
        detail: 'Search query has been formulated from your selection.',
        life: 3000
      });
    } else {
      // Fall back to the original keyword
      searchQuery.value = keyword;
      
      toast.add({
        severity: 'warn',
        summary: 'Using Original Term',
        detail: 'Unable to expand the keyword. Using your original term.',
        life: 3000
      });
    }
  } catch (error) {
    console.error('Error expanding keyword:', error);
    
    // Fall back to the original keyword
    searchQuery.value = keyword;
    
    toast.add({
      severity: 'error',
      summary: 'Expansion Failed',
      detail: 'Could not connect to the expansion service. Please try again.',
      life: 3000
    });
  } finally {
    isExpanding.value = false;
  }
};
</script>

<template>
  <div class="search-container">
    <div class="search-wrapper">
      <div class="image-wrapper">
        <img :src="SearchingPic" alt="Research illustration" class="search-image" />
      </div>
      
      <div class="content-wrapper">
        <h1 class="main-title">Get perfect articles in seconds</h1>
        <p class="subtitle">Find the research you need with AI-powered precision</p>
        
        <div class="search-field-container">
          <div class="input-group">
            <span class="input-icon">
              <i class="pi pi-book"></i>
            </span>
            <InputText 
              v-model="searchQuery" 
              type="text" 
              placeholder="Type your query to find detailed articles..." 
              class="search-input"
              @keydown.enter="handleSearch" 
              :disabled="isExpanding"
            />
            <Button 
              :icon="isExpanding ? 'pi pi-spin pi-spinner' : 'pi pi-search'" 
              class="search-button" 
              severity="primary" 
              aria-label="Search"
              @click="handleSearch" 
              :disabled="isExpanding"
            />
          </div>
        </div>
        
        <div class="search-examples">
          <span class="example-label">Try searching for:</span>
          <div class="example-tags">
            <span 
              class="example-tag" 
              @click="handleKeywordClick('Climate change effects')"
              :class="{ 'disabled': isExpanding }"
            >
              Climate change effects
            </span>
            <span 
              class="example-tag" 
              @click="handleKeywordClick('ML in healthcare')"
              :class="{ 'disabled': isExpanding }"
            >
              ML in healthcare
            </span>
            <span 
              class="example-tag" 
              @click="handleKeywordClick('Sustainable energy')"
              :class="{ 'disabled': isExpanding }"
            >
              Sustainable energy
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8f9fa;
}

.search-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 3rem;
  max-width: 1200px;
  width: 100%;
  background-color: white;
  border-radius: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 3rem;
}

.image-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-image {
  max-width: 200px;
  height: auto;
}

.content-wrapper {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #9D34DA;
  margin: 0;
}

.subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  margin: 0;
}

.search-field-container {
  width: 100%;
  max-width: 600px;
  margin-top: 0.5rem;
}

.input-group {
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 15px;
  color: #6c757d;
  z-index: 1;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  font-size: 1rem;
  border-radius: 0.5rem 0 0 0.5rem;
  border: 1px solid #e9ecef;
  border-right: none;
  background-color: #f8f9fa;
  height: 48px;
  width: 100%;
}

.search-input:focus {
  border-color: #9D34DA;
  box-shadow: 0 0 0 2px rgba(157, 52, 218, 0.2);
  background-color: white;
  outline: none;
}

.search-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.search-button {
  height: 48px;
  width: 48px;
  border-radius: 0 0.5rem 0.5rem 0;
  background-color: #9D34DA;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover:not(:disabled) {
  background-color: #7209b7;
}

.search-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.search-examples {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.example-label {
  font-size: 0.875rem;
  color: #6c757d;
}

.example-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.example-tag {
  display: inline-block;
  padding: 0.4rem 0.75rem;
  background-color: #f1e6f9;
  color: #7209b7;
  border-radius: 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.example-tag:hover:not(.disabled) {
  background-color: #e2cbf0;
  transform: translateY(-2px);
}

.example-tag.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 992px) {
  .search-wrapper {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
    gap: 2rem;
  }
  
  .content-wrapper {
    align-items: center;
  }
  
  .search-field-container {
    max-width: 100%;
  }
  
  .main-title {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .search-container {
    padding: 1rem;
  }
  
  .search-wrapper {
    padding: 1.5rem;
  }
  
  .main-title {
    font-size: 1.75rem;
  }
  
  .example-tags {
    justify-content: center;
  }
}
</style>