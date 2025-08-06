import express from 'express';
import cors from 'cors';
import carScraper from './scrapers/carScraper.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test scraping endpoint
app.post('/api/test-scrape', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('🧪 Testing scraping for:', url);
    
    const carData = await carScraper.scrapeCarListing(url);
    
    res.json({
      success: true,
      url,
      carData
    });
    
  } catch (error) {
    console.error('Test scraping error:', error);
    res.status(500).json({ 
      error: 'Test scraping failed',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Simple test server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
}); 