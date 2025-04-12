import axios from 'axios';

const AI_SERVICE_URL = 'https://server-ai-microservice.onrender.com/sentiment';

export const analyzeSentiment = async (text) => {
  try {
    const response = await axios.post(AI_SERVICE_URL, { text });
    return response.data[0]?.label || 'NEUTRAL';
  } catch (error) {
    console.error('❌ Sentiment analysis failed:', error.message);
    return 'UNKNOWN';
  }
};