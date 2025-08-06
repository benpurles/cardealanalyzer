// Minimal server for Node.js 19 compatibility
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Minimal server running with Zyte API key configured!',
    hasZyteKey: !!process.env.ZYTE_API_KEY
  });
});

// Simple test endpoint
app.post('/api/test', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('🧪 Testing with URL:', url);
    console.log('🔑 Zyte API Key configured:', !!process.env.ZYTE_API_KEY);
    
    // For now, just return a success message
    // We'll implement the actual Zyte scraping once we confirm the server works
    res.json({
      success: true,
      url,
      message: 'Server is working! Zyte API key is configured.',
      zyteKeyConfigured: !!process.env.ZYTE_API_KEY,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ 
      error: 'Test failed',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Zyte API Key: ${process.env.ZYTE_API_KEY ? 'Configured ✅' : 'Missing ❌'}`);
}); 