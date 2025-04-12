const express = require('express');
const cors = require('cors');
require('dotenv').config();

const summarizeRoute = require('./routes/summarize');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/summarize', summarizeRoute);

const PORT = 5003;
app.listen(PORT, () => console.log(`Gemini Microservice running on port ${PORT}`));