import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import carScraper from './scrapers/zyteScraper.js';
import marketDataService from './services/marketDataService.js';
import analysisService from './services/analysisService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 10, // Number of requests
  duration: 60, // Per 60 seconds
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => next())
    .catch(() => {
      res.status(429).json({ 
        error: 'Too many requests. Please try again later.' 
      });
    });
};

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Main analysis endpoint
app.post('/api/analyze', rateLimiterMiddleware, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Analyzing car listing: ${url}`);

    // Step 1: Scrape car data from URL
    const carData = await carScraper.scrapeCarListing(url);
    
    if (!carData) {
      return res.status(404).json({ error: 'Could not extract car data from URL' });
    }

    // Step 2: Get market comparison data
    const marketData = await marketDataService.getMarketComparison(carData);
    
    // Step 3: Perform AI analysis
    const analysis = await analysisService.analyzeDeal(carData, marketData);

    res.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze car listing',
      details: error.message 
    });
  }
});

// Market data endpoint (for testing)
app.get('/api/market-data/:make/:model', async (req, res) => {
  try {
    const { make, model } = req.params;
    const marketData = await marketDataService.getMarketComparison({ make, model });
    res.json({ success: true, data: marketData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Debug endpoint to test scraping
app.post('/api/debug-scrape', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('🔍 Debug scraping URL:', url);
    
    // Get the raw HTML first using axios instead of fetch
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    const html = response.data;
    
    // Try to scrape
    const carData = await carScraper.scrapeCarListing(url);
    
    res.json({
      success: true,
      url,
      htmlLength: html.length,
      carData,
      htmlPreview: html.substring(0, 1000) // First 1000 chars for debugging
    });
    
  } catch (error) {
    console.error('Debug scraping error:', error);
    res.status(500).json({ 
      error: 'Debug scraping failed',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚗 DealAnalyzer API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
}); 