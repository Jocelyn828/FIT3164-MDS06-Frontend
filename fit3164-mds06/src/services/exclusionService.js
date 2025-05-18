const API_URL = 'http://localhost:8000';

export default {
  async analyzeDocument(document, criteria) {
    try {
      console.log("Analyzing document:", document.name, "with criteria:", criteria);
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('document', document);
      formData.append('criteria', criteria);
      
      // Log what we're sending for debugging
      console.log("FormData created with document and criteria");
      
      const response = await fetch(`${API_URL}/api/exclusion/analyze/`, {
        method: 'POST',
        body: formData,
        // No Content-Type header needed as it's set automatically with FormData
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Parsed response:", data);
      return data;
    } catch (error) {
      console.error('Exclusion API error:', error);
      return {
        success: false,
        message: error.message || 'Failed to analyze document'
      };
    }
  }
};