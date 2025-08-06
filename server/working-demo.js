// Working demo server showing Zyte integration concept
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
    message: 'Zyte integration demo is running!',
    hasZyteKey: !!process.env.ZYTE_API_KEY,
    zyteKey: process.env.ZYTE_API_KEY ? `${process.env.ZYTE_API_KEY.substring(0, 8)}...` : 'Not set'
  });
});

// Demo Zyte scraping function (simulated)
async function simulateZyteScraping(url) {
  try {
    console.log('🚀 Simulating Zyte scrape for URL:', url);
    console.log('🔑 Using Zyte API Key:', process.env.ZYTE_API_KEY ? 'Configured ✅' : 'Missing ❌');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll simulate what Zyte would return
    // In reality, this would be the actual Zyte API call
    const mockZyteResponse = {
      success: true,
      browserHtml: `<html><body>
        <h1>2023 Toyota Tacoma TRD Pro</h1>
        <div class="price">$42,500</div>
        <div class="mileage">28,500 miles</div>
        <div class="location">Salt Lake City, UT</div>
        <div class="description">Well-maintained 2023 Toyota Tacoma TRD Pro with premium features.</div>
      </body></html>`
    };
    
    console.log('📄 Simulated Zyte response received');
    
    // Parse the simulated HTML (in real implementation, this would be Cheerio)
    const title = '2023 Toyota Tacoma TRD Pro';
    const price = 42500;
    const year = 2023;
    const make = 'Toyota';
    const model = 'Tacoma';
    const mileage = 28500;
    const location = 'Salt Lake City, UT';
    const description = 'Well-maintained 2023 Toyota Tacoma TRD Pro with premium features.';
    
    const result = {
      url,
      title,
      price,
      year,
      make,
      model,
      mileage,
      location,
      description,
      images: [`https://via.placeholder.com/400x300/0ea5e9/ffffff?text=${encodeURIComponent(make + ' ' + model)}`],
      source: 'Zyte API (simulated)'
    };
    
    console.log('✅ Simulated Zyte scraping result:', result);
    return result;

  } catch (error) {
    console.error('❌ Simulated Zyte scraping error:', error.message);
    return null;
  }
}

// Fallback function to extract data from URL
function extractFromUrl(url) {
  try {
    console.log('🔍 Extracting data from URL pattern:', url);
    
    const urlLower = url.toLowerCase();
    const currentYear = new Date().getFullYear();
    
    // Extract make and model from URL
    let make = 'Toyota';
    let model = 'Camry';
    
    // Check for common car makes in URL
    const makes = ['toyota', 'honda', 'ford', 'bmw', 'mercedes', 'audi', 'lexus', 'nissan', 'chevrolet', 'dodge', 'jeep', 'hyundai', 'kia', 'mazda', 'subaru', 'volkswagen', 'volvo', 'acura', 'infiniti', 'buick', 'cadillac', 'lincoln', 'chrysler', 'pontiac', 'saturn', 'scion', 'mitsubishi', 'suzuki', 'fiat', 'alfa romeo', 'jaguar', 'land rover', 'mini', 'smart', 'tesla', 'rivian', 'lucid', 'polestar'];
    
    for (const carMake of makes) {
      if (urlLower.includes(carMake)) {
        make = carMake.charAt(0).toUpperCase() + carMake.slice(1);
        break;
      }
    }
    
    // Extract model based on make
    const models = {
      'Toyota': ['camry', 'corolla', 'prius', 'rav4', 'highlander', 'tacoma', 'tundra', 'sienna', 'avalon', 'venza'],
      'Honda': ['civic', 'accord', 'cr-v', 'pilot', 'odyssey', 'hr-v', 'passport', 'ridgeline', 'insight', 'clarity'],
      'Ford': ['f-150', 'f-250', 'f-350', 'mustang', 'explorer', 'escape', 'edge', 'expedition', 'ranger', 'bronco'],
      'BMW': ['3 series', '5 series', 'x3', 'x5', 'x7', 'm3', 'm5', 'i3', 'i4', 'ix'],
      'Mercedes': ['c-class', 'e-class', 's-class', 'glc', 'gle', 'gls', 'amg', 'cla', 'cls', 'gla']
    };
    
    const makeModels = models[make] || ['camry'];
    
    for (const carModel of makeModels) {
      if (urlLower.includes(carModel.replace(' ', '')) || urlLower.includes(carModel.replace('-', ''))) {
        model = carModel.charAt(0).toUpperCase() + carModel.slice(1);
        break;
      }
    }
    
    // Extract year from URL if present
    const yearMatch = url.match(/(19|20)\d{2}/);
    const year = yearMatch ? parseInt(yearMatch[0]) : currentYear;
    
    // Generate realistic data based on the extracted info
    const basePrices = {
      'Toyota': { 'Camry': 25000, 'Tacoma': 35000, 'RAV4': 28000, 'Corolla': 22000 },
      'Honda': { 'Civic': 22000, 'Accord': 24000, 'CR-V': 28000, 'Pilot': 35000 },
      'Ford': { 'F-150': 45000, 'Mustang': 30000, 'Explorer': 35000, 'Escape': 25000 },
      'BMW': { '3 Series': 35000, '5 Series': 55000, 'X3': 45000, 'X5': 65000 },
      'Mercedes': { 'C-Class': 45000, 'E-Class': 55000, 'S-Class': 95000, 'GLC': 45000 }
    };
    
    const basePrice = basePrices[make]?.[model] || 25000;
    const priceVariation = Math.random() * 0.4 - 0.2; // ±20%
    const price = Math.round(basePrice * (1 + priceVariation));
    
    const mileageVariation = Math.random() * 0.3 - 0.15; // ±15%
    const mileage = Math.round(45000 * (1 + mileageVariation));
    
    const result = {
      url,
      title: `${year} ${make} ${model}`,
      price,
      year,
      make,
      model,
      mileage,
      location: 'Unknown Location',
      description: `Well-maintained ${year} ${make} ${model} with ${mileage.toLocaleString()} miles.`,
      images: [`https://via.placeholder.com/400x300/0ea5e9/ffffff?text=${encodeURIComponent(make + ' ' + model)}`],
      source: 'URL Pattern Extraction'
    };
    
    console.log('✅ Extracted from URL:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error extracting from URL:', error);
    return null;
  }
}

// Test endpoint
app.post('/api/test', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('🧪 Testing with URL:', url);
    console.log('🔑 Zyte API Key configured:', !!process.env.ZYTE_API_KEY);
    
    // Try Zyte scraping (simulated)
    const carData = await simulateZyteScraping(url);
    
    if (carData) {
      res.json({
        success: true,
        url,
        message: 'Zyte scraping successful! (simulated)',
        carData,
        zyteKeyConfigured: !!process.env.ZYTE_API_KEY,
        timestamp: new Date().toISOString()
      });
    } else {
      // Fall back to URL extraction
      const fallbackData = extractFromUrl(url);
      res.json({
        success: true,
        url,
        message: 'Zyte failed, using URL extraction fallback',
        carData: fallbackData,
        zyteKeyConfigured: !!process.env.ZYTE_API_KEY,
        usedFallback: true,
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ 
      error: 'Test failed',
      details: error.message 
    });
  }
});

// Real Zyte API endpoint (for when you upgrade Node.js)
app.post('/api/zyte-real', async (req, res) => {
  res.json({
    message: 'This endpoint would use the real Zyte API',
    note: 'Upgrade to Node.js 20+ to use the full Zyte integration',
    currentNodeVersion: process.version,
    zyteKeyConfigured: !!process.env.ZYTE_API_KEY
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Working demo server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 Zyte API Key: ${process.env.ZYTE_API_KEY ? 'Configured ✅' : 'Missing ❌'}`);
  console.log(`📝 This is a demo showing how Zyte integration will work`);
  console.log(`💡 Upgrade to Node.js 20+ for full Zyte functionality`);
}); 