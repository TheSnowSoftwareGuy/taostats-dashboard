require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const TAOSTATS_API_URL = process.env.TAOSTATS_API_URL;
const TAOSTATS_API_AUTH = process.env.TAOSTATS_API_AUTH;

// Endpoint to fetch subnet data
app.get('/api/subnets', async (req, res) => {
  try {
    const response = await axios.get(TAOSTATS_API_URL, {
      headers: {
        accept: 'application/json',
        Authorization: TAOSTATS_API_AUTH
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from taostats API:', error.message);
    res.status(500).json({ error: 'Failed to fetch data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
