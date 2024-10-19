// File: app.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

app.post('/api/gst-profile', async (req, res) => {
  const { id } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const url = 'https://uat-hub.perfios.com/api/kscan/v3/gst-profile';
  
  const headers = {
    'Content-Type': 'application/json',
    'x-auth-key': process.env.PERFIOS_API_KEY
  };
  
  const payload = { id };
  
  try {
    const response = await axios.post(url, payload, { headers });
    
    const extractedData = {
      gstin: response.data.result[0].gstin,
      aggregateTurnovers: response.data.result[0].aggregateTurnovers,
      email: response.data.result[0].email,
      legalName: response.data.result[0].legalName,
    };

    res.json(extractedData);
  } catch (error) {
    console.error('Full error:', error);
    console.error('Error response:', error.response ? error.response.data : 'No response data');
    res.status(500).json({ 
      error: 'An error occurred while fetching GST profile', 
      details: error.message,
      response: error.response ? error.response.data : null
    });
  }
});

// Add your other routes and middleware here

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});