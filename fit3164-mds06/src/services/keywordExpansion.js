const API_URL = 'http://localhost:8000';

export default {
   async generateKeywords(query) {
    try {
      // URL encode the query parameter
      const encodedQuery = encodeURIComponent(query);
      
      const response = await fetch(`${API_URL}/api/generate-keywords/?query=${encodedQuery}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
     
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
     
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }
}