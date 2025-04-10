// utils/sentiment.js
import axios from 'axios';

export const analyzeSentiment = async (text) => {
  try {
    const response = await axios.post('http://127.0.0.1:5002/sentiment', { text });
    return response.data[0]?.label || 'NEUTRAL';
  } catch (error) {
    console.error('❌ Sentiment analysis failed:', error.message);
    return 'UNKNOWN';
  }
};
