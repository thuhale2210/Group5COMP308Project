// const axios = require('axios');

// const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
// const API_KEY = process.env.GEMINI_API_KEY;

// exports.getSummary = async (text) => {
//   const prompt = `Summarize the following content:
//   """
//   ${text}
//   """`;

//   const response = await axios.post(`${GEMINI_URL}?key=${API_KEY}`, {
//     contents: [
//       {
//         parts: [{ text: prompt }]
//       }
//     ]
//   });

//   return response.data.candidates[0].content.parts[0].text;
// };

const axios = require('axios');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const API_KEY = process.env.GEMINI_API_KEY;

exports.getSummary = async (text) => {
  const prompt = `Summarize the following content:\n"""\n${text}\n"""`;

  try {
    const response = await axios.post(`${GEMINI_URL}?key=${API_KEY}`, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (err) {
    // 🔍 Log the actual Gemini error response for debugging
    console.error('❌ Gemini API failed:', err.response?.data || err.message);
    throw err;
  }
};
