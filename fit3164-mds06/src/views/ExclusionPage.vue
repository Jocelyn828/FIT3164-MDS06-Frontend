<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import exclusionService from "../services/exclusionService.js";

const toast = useToast();
const router = useRouter();
const route = useRoute();

// Get the original query and keywords from route
const originalQuery = computed(() => route.query.originalQuery || route.query.q || "");
const selectedKeywords = computed(() => (route.query.keywords || "").split(',').filter(k => k));

// State for document upload
const documentFile = ref(null);
const isUploading = ref(false);
const uploadProgress = ref(0);
const documentUploaded = ref(false);
const documentName = ref("");
const documentAnalysisResult = ref(null);

// State for exclusion patterns
const selectedExclusionPatterns = ref([]);
const suggestedPatterns = ref([]);
const customPatterns = ref([]);
const newPatternInput = ref("");

// Loading states
const isLoading = ref(false);
const isAnalyzing = ref(false);

// Check if we have the necessary query parameters
onMounted(async () => {
  if (!originalQuery.value) {
    router.push({ name: "search" });
    return;
  }
  
  // Initialize with empty patterns since we don't fetch them from API
  suggestedPatterns.value = [];
});

// Fallback patterns if needed for later use
const getFallbackPatterns = () => {
  return [
    {
      id: 'fallback-1',
      name: 'Non-empirical studies',
      keywords: ['opinion', 'commentary', 'editorial', 'letter', 'perspective'],
      evidence: 'Documents classified as opinion pieces, commentaries, or editorials without empirical data',
      type: 'suggested'
    },
    {
      id: 'fallback-2',
      name: 'Wrong study population',
      keywords: ['animal study', 'in vitro', 'cell line', 'non-human'],
      evidence: 'Studies that use animal models or in vitro methods instead of human participants',
      type: 'suggested'
    },
    {
      id: 'fallback-3',
      name: 'Irrelevant outcome measures',
      keywords: ['unrelated outcome', 'different metric', 'not measuring target'],
      evidence: 'Studies that measure outcomes not relevant to the research question',
      type: 'suggested'
    },
    {
      id: 'fallback-4',
      name: 'Language barriers',
      keywords: ['non-english', 'translation needed', 'foreign language'],
      evidence: 'Documents not available in the required language',
      type: 'suggested'
    },
    {
      id: 'fallback-5',
      name: 'Duplicate publications',
      keywords: ['duplicate', 'redundant', 'previously published', 'same data'],
      evidence: 'Multiple publications of the same study or data',
      type: 'suggested'
    }
  ];
};

// Handle document file selection
const handleFileChange = (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    documentFile.value = files[0];
    documentName.value = files[0].name;
    
    // Reset any previous analysis
    documentAnalysisResult.value = null;
    documentUploaded.value = false;
  }
};

// Upload and analyze document with the exclusion criterion
const uploadAndAnalyzeDocument = async () => {
  if (!documentFile.value) {
    toast.add({
      severity: 'warn',
      summary: 'No Document',
      detail: 'Please select a document to upload',
      life: 3000
    });
    return;
  }
  
  if (!newPatternInput.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'No Exclusion Criterion',
      detail: 'Please enter an exclusion criterion to analyze',
      life: 3000
    });
    return;
  }
  
  isUploading.value = true;
  isAnalyzing.value = true;
  uploadProgress.value = 0;
  
  try {
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value >= 100) {
        clearInterval(progressInterval);
        return;
      }
      uploadProgress.value = Math.min(uploadProgress.value + 10, 100);
    }, 300);
    
    // Call your API with both document and exclusion criterion
    const analysisResponse = await exclusionService.analyzeDocument(
      documentFile.value,
      newPatternInput.value.trim()
    );
    
    // Clear progress interval
    clearInterval(progressInterval);
    uploadProgress.value = 100;
    
    if (analysisResponse.success && analysisResponse.result) {
      // Document was uploaded and analyzed successfully
      documentUploaded.value = true;
      documentName.value = analysisResponse.documentName || documentName.value;
      
      // Store the analysis result
      documentAnalysisResult.value = analysisResponse.result;
      
      // Create a pattern from the analysis result
      const newPattern = {
        id: `doc-pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: analysisResponse.result.classification || newPatternInput.value.trim(),
        keywords: analysisResponse.result.keywords || [],
        evidence: analysisResponse.result.reason || "No reason provided",
        type: 'document'
      };
      
      // Add to suggested patterns
      suggestedPatterns.value = [...suggestedPatterns.value, newPattern];
      
      // Add to selected patterns
      selectedExclusionPatterns.value.push(newPattern);
      
      // Clear the input after successful analysis
      newPatternInput.value = "";
      
      toast.add({
        severity: 'success',
        summary: 'Analysis Complete',
        detail: 'Document analyzed successfully',
        life: 3000
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Analysis Failed',
        detail: analysisResponse.message || 'Failed to analyze document',
        life: 3000
      });
    }
  } catch (error) {
    console.error("Error analyzing document:", error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to analyze document',
      life: 3000
    });
  } finally {
    isUploading.value = false;
    isAnalyzing.value = false;
  }
};

// Toggle pattern selection
const togglePattern = (pattern) => {
  const index = selectedExclusionPatterns.value.findIndex(p => p.id === pattern.id);
  if (index > -1) {
    selectedExclusionPatterns.value.splice(index, 1);
  } else {
    selectedExclusionPatterns.value.push(pattern);
  }
};

// Add custom pattern without document analysis
const addCustomPattern = () => {
  if (!newPatternInput.value.trim()) {
    return;
  }
  
  const newPattern = {
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: newPatternInput.value.trim(),
    keywords: [],
    evidence: 'User-defined exclusion pattern',
    type: 'custom'
  };
  
  customPatterns.value.push(newPattern);
  selectedExclusionPatterns.value.push(newPattern);
  newPatternInput.value = "";
};

// Remove custom pattern
const removeCustomPattern = (patternId) => {
  const customIndex = customPatterns.value.findIndex(p => p.id === patternId);
  if (customIndex > -1) {
    customPatterns.value.splice(customIndex, 1);
    
    // Also remove from selected patterns if it's there
    const selectedIndex = selectedExclusionPatterns.value.findIndex(p => p.id === patternId);
    if (selectedIndex > -1) {
      selectedExclusionPatterns.value.splice(selectedIndex, 1);
    }
  }
};

// Continue to search results with the exclusion criteria
const continueToResults = () => {
  // Show success toast if patterns were selected
  if (selectedExclusionPatterns.value.length > 0) {
    toast.add({
      severity: 'success',
      summary: 'Exclusion Criteria Added',
      detail: `Added ${selectedExclusionPatterns.value.length} exclusion patterns to your search`,
      life: 3000
    });
  }
  
  // Convert selected patterns to a comma-separated string for URL
  const patternsParam = selectedExclusionPatterns.value
    .map(p => encodeURIComponent(p.name))
    .join(',');
  
  // Get keywords from patterns
  const keywordsFromPatterns = selectedExclusionPatterns.value
    .flatMap(p => p.keywords || [])
    .filter(k => k);
  
  // Create exclusion criteria string for the query
  const exclusionTerms = keywordsFromPatterns.length > 0 
    ? ` AND NOT (${keywordsFromPatterns.map(k => `"${k}"`).join(' OR ')})` 
    : '';
  
  // Build final query with exclusion terms
  const finalQuery = `${route.query.q}${exclusionTerms}`;
  
  // Navigate to results with the query and exclusion criteria
  router.push({ 
    name: 'results', 
    query: { 
      q: finalQuery,
      originalQuery: originalQuery.value,
      keywords: route.query.keywords || '',
      exclusionPatterns: patternsParam,
      exclusionDocument: documentUploaded.value ? documentName.value : ''
    } 
  });
};

// Skip to results page without applying exclusions
const skipToResults = () => {
  router.push({ 
    name: 'results', 
    query: { 
      q: route.query.q,
      originalQuery: originalQuery.value,
      keywords: route.query.keywords || '' 
    } 
  });
};

// Navigate back to keyword page
const goBack = () => {
  router.push({ 
    name: "keyword",
    query: {
      q: originalQuery.value
    }
  });
};
</script>

<template>
  <div class="exclusion-wrapper">
    <div class="top-navigation">
      <button class="back-button" @click="goBack">
        <i class="pi pi-chevron-left"></i> 
        <span>Back to Keywords</span>
      </button>
    </div>
    
    <div class="exclusion-container">
      <div class="exclusion-text">
        <h1>Define Exclusion Criteria</h1>
        <h2>Input patterns to exclude irrelevant documents from your search results.</h2>
        <p class="query-info">
          <span class="query-label">Query:</span> 
          <span class="query-text">{{ originalQuery }}</span>
          <span v-if="selectedKeywords.length > 0" class="keywords-label">
            with keywords: <span class="keyword-pill" v-for="keyword in selectedKeywords" :key="keyword">{{ keyword }}</span>
          </span>
        </p>
      </div>
      
      <!-- Document Analysis Section -->
      <div class="upload-section">
        <h3>
          <i class="pi pi-file-import"></i>
          Document Exclusion Analysis
        </h3>
        <p class="upload-description">
          Enter an exclusion criterion and upload a document to analyze
        </p>
        
        <!-- Exclusion Criterion Input -->
        <div class="criterion-input" style="margin-bottom: 16px;">
          <InputText 
            v-model="newPatternInput" 
            placeholder="Enter exclusion criterion (e.g., Non-English, Wrong Population, etc.)" 
            style="width: 100%;"
          />
        </div>
        
        <div class="upload-controls">
          <div class="file-input-container">
            <input 
              type="file" 
              id="document-upload" 
              @change="handleFileChange" 
              accept=".doc,.docx,.pdf,.txt"
              :disabled="isUploading || isAnalyzing"
            />
            <label for="document-upload" class="file-input-label">
              <i class="pi pi-upload"></i>
              <span v-if="!documentFile">Choose File</span>
              <span v-else>{{ documentFile.name }}</span>
            </label>
          </div>
          
          <Button 
            class="upload-button" 
            icon="pi pi-sync" 
            label="Analyze Document" 
            :loading="isUploading || isAnalyzing" 
            :disabled="!documentFile || !newPatternInput.trim()"
            @click="uploadAndAnalyzeDocument" 
          />
        </div>
        
        <!-- Upload Progress -->
        <div v-if="isUploading || isAnalyzing" class="upload-progress">
          <ProgressBar :value="Math.min(uploadProgress, 100)" :style="{ height: '10px' }" />
          <p v-if="isUploading">Uploading document: {{ Math.min(uploadProgress, 100) }}%</p>
          <p v-if="isAnalyzing">Analyzing document with criterion: "{{ newPatternInput }}"</p>
        </div>
        
        <!-- Success Message -->
        <div v-if="documentUploaded" class="upload-success">
          <i class="pi pi-check-circle"></i>
          <span>Document analyzed successfully.</span>
        </div>
      </div>
      
      <!-- Analysis Results Display -->
      <div v-if="documentAnalysisResult" class="analysis-results">
        <h3>
          <i class="pi pi-list"></i>
          Analysis Results
        </h3>
        <div class="result-card">
          <div class="result-header">
            <span class="result-classification">{{ documentAnalysisResult.classification }}</span>
            <span class="status-tag excluded">EXCLUDED</span>
          </div>
          
          <div class="result-reason">
            <strong>Reason:</strong> {{ documentAnalysisResult.reason }}
          </div>
          
          <div class="result-keywords" v-if="documentAnalysisResult.keywords && documentAnalysisResult.keywords.length">
            <strong>Key terms:</strong>
            <span 
              v-for="(keyword, idx) in documentAnalysisResult.keywords" 
              :key="`result-kw-${idx}`"
              class="result-keyword"
            >
              {{ keyword }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Patterns Section -->
      <div class="patterns-section">
        <h3>
          <i class="pi pi-filter"></i>
          Exclusion Patterns
        </h3>
        
        <!-- Add Pattern Manually -->
        <div class="custom-pattern-input">
          <div class="input-group">
            <InputText 
              v-model="newPatternInput" 
              placeholder="Add a custom exclusion pattern..." 
              @keyup.enter="addCustomPattern"
            />
            <Button 
              icon="pi pi-plus" 
              @click="addCustomPattern" 
              :disabled="!newPatternInput.trim()"
            />
          </div>
          <p class="input-hint">You can also add patterns manually without document analysis</p>
        </div>
        
        <!-- Custom Patterns -->
        <div v-if="customPatterns.length > 0" class="pattern-group">
          <h4>Your Custom Patterns</h4>
          <div class="pattern-list">
            <div 
              v-for="pattern in customPatterns" 
              :key="pattern.id" 
              class="pattern-card custom-pattern"
              :class="{ 'pattern-selected': selectedExclusionPatterns.some(p => p.id === pattern.id) }"
              @click="togglePattern(pattern)"
            >
              <div class="pattern-header">
                <span class="pattern-name">{{ pattern.name }}</span>
                <i 
                  class="pi pi-times remove-pattern" 
                  @click.stop="removeCustomPattern(pattern.id)"
                ></i>
              </div>
              <div class="pattern-type">Custom pattern</div>
            </div>
          </div>
        </div>
        
        <!-- Patterns from Document Analysis -->
        <div v-if="suggestedPatterns.length > 0" class="pattern-group">
          <h4>Patterns from Document Analysis</h4>
          <div class="pattern-list">
            <div 
              v-for="pattern in suggestedPatterns" 
              :key="pattern.id" 
              class="pattern-card document-pattern"
              :class="{ 'pattern-selected': selectedExclusionPatterns.some(p => p.id === pattern.id) }"
              @click="togglePattern(pattern)"
            >
              <div class="pattern-header">
                <span class="pattern-name">{{ pattern.name }}</span>
                <i class="pi pi-check-circle pattern-check"></i>
              </div>
              <div class="pattern-keywords" v-if="pattern.keywords && pattern.keywords.length">
                <span 
                  v-for="(keyword, index) in pattern.keywords.slice(0, 3)" 
                  :key="`${pattern.id}-kw-${index}`"
                  class="pattern-keyword"
                >
                  {{ keyword }}
                </span>
                <span v-if="pattern.keywords.length > 3" class="more-keywords">
                  +{{ pattern.keywords.length - 3 }} more
                </span>
              </div>
              <div class="pattern-evidence">{{ pattern.evidence }}</div>
              <div class="pattern-source">
                <i class="pi pi-file"></i> From document analysis
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Selected Patterns Summary -->
      <div class="selected-patterns" v-if="selectedExclusionPatterns.length > 0">
        <h3>
          <i class="pi pi-check-circle"></i>
          {{ selectedExclusionPatterns.length }} pattern{{ selectedExclusionPatterns.length > 1 ? 's' : '' }} selected
        </h3>
        <div class="selected-tags">
          <span 
            v-for="pattern in selectedExclusionPatterns" 
            :key="`selected-${pattern.id}`" 
            class="selected-tag"
          >
            {{ pattern.name }}
            <i class="pi pi-times" @click="togglePattern(pattern)"></i>
          </span>
        </div>
      </div>
      
      <!-- Navigation Buttons -->
      <div class="button-container">
        <Button 
          class="skip-button" 
          label="Skip" 
          icon="pi pi-arrow-right" 
          iconPos="right" 
          severity="secondary"
          outlined
          @click="skipToResults" 
        />
        <Button 
          class="apply-button" 
          label="Apply Exclusions" 
          icon="pi pi-check" 
          iconPos="right" 
          :disabled="selectedExclusionPatterns.length === 0"
          @click="continueToResults" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.exclusion-wrapper {
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
  font-family: 'inherit';
  transition: all 0.2s ease;
}

.back-button:hover {
  background-color: #f8f9fa;
  transform: translateX(-3px);
  color: #9D34DA;
}

.back-button i {
  font-size: 14px;
}

.exclusion-container {
  position: relative;
  width: 100%;
  max-width: 1000px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  padding: 32px;
}

.exclusion-text h1 {
  font-size: 28px;
  font-weight: bold;
  line-height: 1.2;
  color: #9D34DA;
  margin: 0 0 16px 0;
  text-align: left;
}

.exclusion-text h2 {
  font-size: 16px;
  font-weight: normal;
  line-height: 1.4;
  color: #6c757d;
  margin: 0 0 24px 0;
  text-align: left;
}

.query-info {
  background-color: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  border-left: 4px solid #9D34DA;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.query-label {
  font-weight: 600;
  color: #212529;
}

.query-text {
  color: #495057;
  font-weight: 500;
  margin: 0;
}

.keywords-label {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  color: #6c757d;
}

.keyword-pill {
  background-color: #f1e6f9;
  color: #9D34DA;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  white-space: nowrap;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #6c757d;
}

/* Upload Section Styles */
.upload-section {
  margin-bottom: 24px;
  padding: 24px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.upload-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
}

.upload-section h3 i {
  color: #9D34DA;
}

.upload-description {
  color: #6c757d;
  margin-bottom: 16px;
}

.upload-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.file-input-container {
  flex: 1;
}

.file-input-container input[type="file"] {
  display: none;
}

.file-input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: white;
  border: 1px solid #ced4da;
  border-radius: 6px;
  cursor: pointer;
  color: #495057;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.file-input-label:hover {
  border-color: #9D34DA;
  color: #9D34DA;
}

.upload-button {
  background-color: #f1e6f9;
  border-color: #9D34DA;
  color: #9D34DA;
}

.upload-button:hover:not(:disabled) {
  background-color: #9D34DA;
  border-color: #9D34DA;
  color: white;
}

.upload-progress {
  margin-top: 16px;
}

.upload-progress p {
  margin-top: 8px;
  color: #6c757d;
  font-size: 14px;
}

.upload-success {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2dce89;
  margin-top: 16px;
  padding: 8px 12px;
  background-color: rgba(45, 206, 137, 0.1);
  border-radius: 6px;
}

/* Analysis Results Styles */
.analysis-results {
  margin-bottom: 24px;
  padding: 24px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #9D34DA;
}

.analysis-results h3 {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
}

.analysis-results h3 i {
  color: #9D34DA;
}

.result-card {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-classification {
  font-weight: 600;
  font-size: 16px;
  color: #212529;
}

.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-tag.excluded {
  background-color: #ffdddd;
  color: #dc3545;
}

.result-reason {
  margin-bottom: 12px;
  color: #495057;
  line-height: 1.5;
}

.result-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.result-keyword {
  background-color: #f1e6f9;
  color: #9D34DA;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
}

/* Patterns Section Styles */
.patterns-section {
  margin-bottom: 32px;
}

.patterns-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
}

.patterns-section h3 i {
  color: #9D34DA;
}

.custom-pattern-input {
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  gap: 8px;
}

.input-group :deep(.p-inputtext) {
  flex: 1;
  padding: 10px 16px;
}

.input-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #6c757d;
}

.pattern-group {
  margin-bottom: 24px;
}

.pattern-group h4 {
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  margin: 0 0 12px 0;
}

.pattern-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.pattern-card {
  position: relative;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pattern-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  border-color: #9D34DA;
}

.pattern-card.pattern-selected {
  background-color: #f1e6f9;
  border-color: #9D34DA;
}

.pattern-card.document-pattern {
  border-left: 4px solid #2dce89;
}

.pattern-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.pattern-name {
  font-weight: 600;
  color: #212529;
}

.pattern-check {
  visibility: hidden;
  color: #9D34DA;
}

.pattern-selected .pattern-check {
  visibility: visible;
}

.pattern-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.pattern-keyword {
  background-color: #e9ecef;
  color: #495057;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.more-keywords {
  font-size: 12px;
  color: #6c757d;
}

.pattern-evidence {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 8px;
  line-height: 1.4;
}

.pattern-source {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #2dce89;
}

.pattern-type {
  font-size: 12px;
  color: #6c757d;
  font-style: italic;
}

.custom-pattern {
  background-color: #fff6e9;
  border-left: 4px solid #fd7e14;
}

.remove-pattern {
  color: #dc3545;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.remove-pattern:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

/* Selected Patterns Summary */
.selected-patterns {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
}

.selected-patterns h3 {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.selected-patterns h3 i {
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

/* Button Container */
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
  .exclusion-container {
    padding: 24px 16px;
  }
  
  .exclusion-text h1 {
    font-size: 24px;
  }
  
  .pattern-list {
    grid-template-columns: 1fr;
  }
  
  .upload-controls {
    flex-direction: column;
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