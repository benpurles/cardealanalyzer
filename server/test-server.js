import express from 'express';
import cors from 'cors';
import carScraper from './scrapers/zyteScraper.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Zyte-powered car scraper is running!'
  });
});

// Test scraping endpoint
app.post('/api/test-scrape', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('🧪 Testing Zyte scraping for:', url);
    
    const carData = await carScraper.scrapeCarListing(url);
    
    res.json({
      success: true,
      url,
      carData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Test scraping error:', error);
    res.status(500).json({ 
      error: 'Test scraping failed',
      details: error.message 
    });
  }
});

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Analyzing car listing: ${url}`);

    // Step 1: Scrape car data from URL using Zyte
    const carData = await carScraper.scrapeCarListing(url);
    
    if (!carData) {
      return res.status(404).json({ error: 'Could not extract car data from URL' });
    }

    // For now, return the scraped data directly
    // In a full implementation, you'd add market data and analysis here
    res.json({
      success: true,
      data: {
        listing: carData,
        dealScore: 75,
        recommendation: 'good',
        reasoning: ['Successfully scraped car data using Zyte API'],
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze car listing',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Zyte-powered test server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Make sure to set ZYTE_API_KEY in your environment variables`);
}); 