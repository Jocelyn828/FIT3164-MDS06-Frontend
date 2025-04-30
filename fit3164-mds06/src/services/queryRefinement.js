const API_URL = 'http://localhost:8000';

export default {
  async searchArticles(message) {
    try {
      const response = await fetch(`${API_URL}/api/vector-search/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
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
};
