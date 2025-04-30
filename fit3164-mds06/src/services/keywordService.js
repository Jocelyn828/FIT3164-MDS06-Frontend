const API_URL = 'http://localhost:8000';

export default {
  async expandKeyword(keyword) {
    try {
      const response = await fetch(`${API_URL}/api/expand-keyword/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword }),
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