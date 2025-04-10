const axios = require('axios');

axios.post('http://localhost:5003/summarize', {
  text: `I'm facing issues with my order delivery. It was supposed to arrive last week but I haven't received any updates yet. Please help!`
}).then(res => {
  console.log('✅ Summary:', res.data.summary);
}).catch(err => {
  console.error('❌ Error:', err.message);
});
