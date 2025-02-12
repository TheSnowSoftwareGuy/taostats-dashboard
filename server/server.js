require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
// Uncomment the following two lines if you prefer to use Helmet for security headers
// const helmet = require('helmet');
// app.use(helmet());

const app = express();

// Option 1: Use a simple middleware to set a Content Security Policy header
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; font-src 'self' https://taostats-dashboard.onrender.com"
  );
  next();
});

// Option 2: Use Helmet's CSP configuration (ensure Helmet is installed and uncomment the code below)
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       fontSrc: ["'self'", "https://taostats-dashboard.onrender.com"],
//       // You can add other directives as needed
//     },
//   })
// );

app.use(cors());

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, '../frontend/build')));

const PORT = process.env.PORT || 5000;
const TAOSTATS_API_URL = process.env.TAOSTATS_API_URL;
const TAOSTATS_API_AUTH = process.env.TAOSTATS_API_AUTH;

// API endpoint to fetch subnet data
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

// Catch-all handler: for any request that doesn't match an API route or a static file,
// send back the React app's index.html so that React Router can handle the routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
