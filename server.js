import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug: Check if environment variables are loaded
console.log('Environment check:');
console.log('STABILITY_API_KEY exists:', !!process.env.STABILITY_API_KEY);
console.log('STABILITY_API_KEY length:', process.env.STABILITY_API_KEY ? process.env.STABILITY_API_KEY.length : 0);
console.log('STABILITY_API_KEY starts with:', process.env.STABILITY_API_KEY ? process.env.STABILITY_API_KEY.substring(0, 10) + '...' : 'undefined');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API endpoint
app.post('/api/generate', async (req, res) => {
  console.log('API generate endpoint called');
  const { prompt } = req.body;

  console.log('Checking API key...');
  console.log('STABILITY_API_KEY exists:', !!process.env.STABILITY_API_KEY);

  if (!process.env.STABILITY_API_KEY) {
    console.log('API key not configured');
    return res.status(500).json({ error: "API key not configured. Get a free API key from https://platform.stability.ai/" });
  }

  try {
    console.log('Making request to Stability AI API...');
    
    // Use Stability AI's API format
    const requestBody = {
      text_prompts: [
        {
          text: prompt,
          weight: 1
        }
      ],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      samples: 1,
      steps: 30,
      style_preset: "photographic"
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.log('API error:', errorData);
      return res.status(response.status).json({ error: errorData.error?.message || 'API request failed' });
    }

    const data = await response.json();
    console.log('API response received');
    
    // Extract the image data from the response
    let imageData = null;
    if (data.artifacts && Array.isArray(data.artifacts) && data.artifacts.length) {
      const artifact = data.artifacts[0];
      if (artifact.base64) {
        imageData = `data:image/png;base64,${artifact.base64}`;
      }
    }
    
    if (!imageData) {
      console.log('No image data found in response');
      return res.status(500).json({ error: "No image found in API response" });
    }

    console.log('Sending image data back to client');
    res.json({ image: imageData });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
