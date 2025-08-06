import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Universal car listing scraper
class UniversalCarScraper {
  constructor() {
    this.zyteApiKey = process.env.ZYTE_API_KEY;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  // Main scraping function
  async scrapeCarListing(url) {
    try {
      console.log('🚀 Universal scraper starting for:', url);
      
      // Step 1: Validate URL and check if it's a car listing
      const isValidCarListing = await this.validateCarListing(url);
      if (!isValidCarListing) {
        throw new Error('This URL does not appear to be a car listing. Please provide a valid car listing URL.');
      }

      // Step 2: Get page content (try Zyte first, then direct scraping)
      const html = await this.getPageContent(url);
      if (!html) {
        throw new Error('Could not access the webpage. The URL may be invalid or the site may be blocking access.');
      }

      // Step 3: Extract car data using AI and pattern matching
      const carData = await this.extractCarData(html, url);
      if (!carData) {
        throw new Error('Could not extract car information from this page. The listing may be incomplete or in an unsupported format.');
      }

      // Step 4: Validate extracted data
      const validation = this.validateCarData(carData);
      if (!validation.isValid) {
        console.warn('⚠️ Data validation warnings:', validation.warnings);
      }

      console.log('✅ Universal scraping successful:', carData);
      return carData;

    } catch (error) {
      console.error('❌ Universal scraping failed:', error.message);
      throw error;
    }
  }

  // Validate if URL is likely a car listing
  async validateCarListing(url) {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      
      // Known car listing domains
      const carDomains = [
        'cars.com', 'autotrader.com', 'cargurus.com', 'carmax.com', 
        'edmunds.com', 'carsdirect.com', 'truecar.com', 'carvana.com',
        'vroom.com', 'shift.com', 'driveway.com', 'carfax.com',
        'kbb.com', 'nada.com', 'autolist.com', 'carsforsale.com'
      ];

      // Check if it's a known car domain
      if (carDomains.some(domain => url.toLowerCase().includes(domain))) {
        return true;
      }

      // For unknown domains, use AI to analyze the URL
      if (this.openaiApiKey) {
        return await this.aiValidateCarListing(url);
      }

      // Fallback: check for car-related keywords in URL
      const carKeywords = ['car', 'vehicle', 'auto', 'truck', 'suv', 'sedan', 'hatchback', 'wagon'];
      return carKeywords.some(keyword => url.toLowerCase().includes(keyword));

    } catch (error) {
      console.error('❌ URL validation error:', error);
      return false;
    }
  }

  // AI-powered car listing validation
  async aiValidateCarListing(url) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: 'You are a car listing validator. Analyze if a URL is likely a car listing page. Respond with only "true" or "false".'
        }, {
          role: 'user',
          content: `Is this URL likely a car listing page? ${url}`
        }],
        max_tokens: 10,
        temperature: 0
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const result = response.data.choices[0].message.content.toLowerCase().trim();
      return result === 'true';

    } catch (error) {
      console.error('❌ AI validation error:', error);
      return false;
    }
  }

  // Get page content using Zyte or direct scraping
  async getPageContent(url) {
    try {
      // Try Zyte first if API key is available
      if (this.zyteApiKey) {
        const zyteHtml = await this.scrapeWithZyte(url);
        if (zyteHtml) {
          return zyteHtml;
        }
      }

      // Fallback to direct scraping
      return await this.scrapeDirect(url);

    } catch (error) {
      console.error('❌ Page content error:', error);
      return null;
    }
  }

  // Zyte API scraping
  async scrapeWithZyte(url) {
    try {
      console.log('🔧 Using Zyte API for:', url);
      
      const response = await axios.post('https://api.zyte.com/v1/extract', {
        url: url,
        browserHtml: true,
        javascript: true,
        screenshot: false,
        actions: [
          {
            action: 'wait',
            selector: 'body',
            timeout: 5000
          }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${this.zyteApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      if (response.data && response.data.browserHtml) {
        console.log('✅ Zyte scraping successful');
        return response.data.browserHtml;
      }

      return null;

    } catch (error) {
      console.error('❌ Zyte scraping failed:', error.message);
      return null;
    }
  }

  // Direct scraping with axios
  async scrapeDirect(url) {
    try {
      console.log('🔧 Using direct scraping for:', url);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        timeout: 15000,
        maxRedirects: 5,
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });

      console.log('✅ Direct scraping successful');
      return response.data;

    } catch (error) {
      console.error('❌ Direct scraping failed:', error.message);
      return null;
    }
  }

  // Extract car data using AI and pattern matching
  async extractCarData(html, url) {
    try {
      const $ = cheerio.load(html);
      
      // Step 1: Try AI extraction if available
      if (this.openaiApiKey) {
        const aiData = await this.aiExtractCarData($, url);
        if (aiData && this.isValidCarData(aiData)) {
          return aiData;
        }
      }

      // Step 2: Use intelligent pattern matching
      return this.patternExtractCarData($, url);

    } catch (error) {
      console.error('❌ Data extraction error:', error);
      return null;
    }
  }

  // AI-powered car data extraction
  async aiExtractCarData($, url) {
    try {
      // Get relevant text content
      const pageText = $('body').text().substring(0, 4000); // Limit to avoid token limits
      
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: 'Extract car information from the page content. Return a JSON object with: title, price (number), year (number), make, model, mileage (number), location, description. If any field is not found, use null.'
        }, {
          role: 'user',
          content: `Extract car data from this page content: ${pageText}`
        }],
        max_tokens: 500,
        temperature: 0
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const result = response.data.choices[0].message.content;
      const carData = JSON.parse(result);
      
      console.log('🤖 AI extraction result:', carData);
      return carData;

    } catch (error) {
      console.error('❌ AI extraction error:', error);
      return null;
    }
  }

  // Intelligent pattern matching for car data
  patternExtractCarData($, url) {
    try {
      console.log('🔍 Using pattern matching extraction');
      
      // Extract title
      const title = this.extractTitle($);
      
      // Extract price
      const price = this.extractPrice($);
      
      // Extract year, make, model from title
      const { year, make, model } = this.extractVehicleInfo(title);
      
      // Extract mileage
      const mileage = this.extractMileage($);
      
      // Extract location
      const location = this.extractLocation($);
      
      // Extract description
      const description = this.extractDescription($);
      
      // Extract images
      const images = this.extractImages($);
      
      const carData = {
        title: title || 'Vehicle Listing',
        price: price,
        year: year,
        make: make,
        model: model,
        mileage: mileage,
        location: location,
        description: description,
        images: images,
        source: 'Universal Scraper',
        url: url
      };

      console.log('🔍 Pattern extraction result:', carData);
      return carData;

    } catch (error) {
      console.error('❌ Pattern extraction error:', error);
      return null;
    }
  }

  // Extract title using multiple selectors
  extractTitle($) {
    const selectors = [
      'h1',
      '.vehicle-title',
      '.car-title',
      '.listing-title',
      '[class*="title"]',
      '[class*="heading"]',
      '.product-title',
      '.item-title'
    ];

    for (const selector of selectors) {
      const title = $(selector).first().text().trim();
      if (title && title.length > 5) {
        return title;
      }
    }

    return null;
  }

  // Extract price using multiple patterns
  extractPrice($) {
    const priceSelectors = [
      '.price',
      '.vehicle-price',
      '.car-price',
      '[class*="price"]',
      '[data-testid*="price"]',
      '.amount',
      '.cost'
    ];

    for (const selector of priceSelectors) {
      const priceText = $(selector).text().trim();
      const price = this.parsePrice(priceText);
      if (price) {
        return price;
      }
    }

    return null;
  }

  // Parse price from text
  parsePrice(priceText) {
    if (!priceText) return null;
    
    // Remove common price prefixes/suffixes
    const cleanText = priceText
      .replace(/[^\d,]/g, '') // Keep only digits and commas
      .replace(/,/g, ''); // Remove commas
    
    const price = parseInt(cleanText);
    return isNaN(price) ? null : price;
  }

  // Extract vehicle information from title
  extractVehicleInfo(title) {
    if (!title) return { year: null, make: null, model: null };

    // Common car makes
    const makes = [
      'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes', 'Audi',
      'Volkswagen', 'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Jeep', 'Dodge', 'Chrysler',
      'Lexus', 'Acura', 'Infiniti', 'Cadillac', 'Buick', 'Pontiac', 'Saturn',
      'Volvo', 'Saab', 'Fiat', 'Alfa Romeo', 'Jaguar', 'Land Rover', 'Mini',
      'Smart', 'Scion', 'Mitsubishi', 'Suzuki', 'Isuzu', 'Daihatsu'
    ];

    // Extract year (4-digit number at start)
    const yearMatch = title.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? parseInt(yearMatch[0]) : null;

    // Extract make
    let make = null;
    for (const carMake of makes) {
      if (title.toLowerCase().includes(carMake.toLowerCase())) {
        make = carMake;
        break;
      }
    }

    // Extract model (simplified - would need more sophisticated logic)
    let model = null;
    if (make) {
      const afterMake = title.substring(title.toLowerCase().indexOf(make.toLowerCase()) + make.length);
      const modelMatch = afterMake.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/);
      if (modelMatch) {
        model = modelMatch[0].trim();
      }
    }

    return { year, make, model };
  }

  // Extract mileage
  extractMileage($) {
    const mileageSelectors = [
      '.mileage',
      '.vehicle-mileage',
      '.car-mileage',
      '[class*="mileage"]',
      '[data-testid*="mileage"]'
    ];

    for (const selector of mileageSelectors) {
      const mileageText = $(selector).text().trim();
      const mileage = this.parseMileage(mileageText);
      if (mileage) {
        return mileage;
      }
    }

    return null;
  }

  // Parse mileage from text
  parseMileage(mileageText) {
    if (!mileageText) return null;
    
    const cleanText = mileageText
      .replace(/[^\d,]/g, '') // Keep only digits and commas
      .replace(/,/g, ''); // Remove commas
    
    const mileage = parseInt(cleanText);
    return isNaN(mileage) ? null : mileage;
  }

  // Extract location
  extractLocation($) {
    const locationSelectors = [
      '.location',
      '.dealer-location',
      '.seller-location',
      '[class*="location"]',
      '.address',
      '.city'
    ];

    for (const selector of locationSelectors) {
      const location = $(selector).text().trim();
      if (location && location.length > 2) {
        return location;
      }
    }

    return 'Unknown Location';
  }

  // Extract description
  extractDescription($) {
    const descSelectors = [
      '.description',
      '.vehicle-description',
      '.car-description',
      '[class*="description"]',
      '.details',
      '.features'
    ];

    for (const selector of descSelectors) {
      const description = $(selector).text().trim();
      if (description && description.length > 20) {
        return description.substring(0, 500); // Limit length
      }
    }

    return 'Well-maintained vehicle with good features.';
  }

  // Extract images
  extractImages($) {
    const images = [];
    
    // Look for car images
    $('img').each((i, elem) => {
      const src = $(elem).attr('src');
      const alt = $(elem).attr('alt') || '';
      
      if (src && (alt.toLowerCase().includes('car') || 
                  alt.toLowerCase().includes('vehicle') ||
                  src.includes('car') ||
                  src.includes('vehicle'))) {
        images.push(src);
      }
    });

    return images.slice(0, 5); // Limit to 5 images
  }

  // Validate extracted car data
  validateCarData(carData) {
    const warnings = [];
    let isValid = true;

    if (!carData.title || carData.title.length < 3) {
      warnings.push('Title is missing or too short');
      isValid = false;
    }

    if (!carData.price || carData.price < 1000 || carData.price > 500000) {
      warnings.push('Price seems unrealistic');
    }

    if (!carData.year || carData.year < 1900 || carData.year > new Date().getFullYear() + 1) {
      warnings.push('Year seems invalid');
    }

    if (!carData.make) {
      warnings.push('Make could not be determined');
    }

    if (!carData.model) {
      warnings.push('Model could not be determined');
    }

    if (!carData.mileage || carData.mileage < 0 || carData.mileage > 500000) {
      warnings.push('Mileage seems unrealistic');
    }

    return { isValid, warnings };
  }

  // Check if car data is valid
  isValidCarData(carData) {
    return carData && 
           carData.title && 
           carData.price && 
           carData.year && 
           carData.make;
  }
}

// Initialize scraper
const scraper = new UniversalCarScraper();

// API Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    message: 'Universal Car Scraper API',
    hasZyteKey: !!process.env.ZYTE_API_KEY,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    version: '2.0.0'
  });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('🚀 Analyzing car listing:', url);

    // Scrape car data
    const carData = await scraper.scrapeCarListing(url);
    
    if (!carData) {
      return res.status(404).json({ 
        error: 'Could not extract car data from this URL',
        details: 'The URL may not be a valid car listing or the format is not supported.',
        url: url
      });
    }

    // Generate market comparison (simulated for now)
    const marketComparison = {
      averagePrice: Math.round(carData.price * (0.9 + Math.random() * 0.2)),
      priceRange: {
        low: Math.round(carData.price * 0.8),
        high: Math.round(carData.price * 1.2)
      },
      marketTrend: Math.random() > 0.5 ? 'stable' : 'declining',
      daysOnMarket: Math.floor(Math.random() * 30) + 1
    };

    // Calculate deal score
    const priceDiff = ((carData.price - marketComparison.averagePrice) / marketComparison.averagePrice) * 100;
    let dealScore = 50; // Base score

    if (priceDiff < -10) dealScore += 20; // Good deal
    else if (priceDiff > 10) dealScore -= 20; // Overpriced
    else dealScore += 10; // Fair price

    // Adjust for mileage
    if (carData.mileage < 30000) dealScore += 10;
    else if (carData.mileage > 100000) dealScore -= 10;

    // Adjust for year
    const currentYear = new Date().getFullYear();
    if (carData.year >= currentYear - 2) dealScore += 10;
    else if (carData.year < currentYear - 10) dealScore -= 10;

    dealScore = Math.max(0, Math.min(100, dealScore));

    // Generate analysis
    const analysis = {
      dealScore: Math.round(dealScore),
      priceAnalysis: {
        isGoodDeal: priceDiff < -5,
        priceDifference: Math.round(priceDiff),
        recommendation: priceDiff < -10 ? 'Excellent deal' : 
                       priceDiff < -5 ? 'Good deal' : 
                       priceDiff > 10 ? 'Overpriced' : 'Fair price'
      },
      pros: this.generatePros(carData, marketComparison),
      cons: this.generateCons(carData, marketComparison),
      reasoning: this.generateReasoning(carData, marketComparison, dealScore),
      recommendation: dealScore >= 70 ? 'Buy' : dealScore >= 50 ? 'Consider' : 'Pass'
    };

    res.json({
      success: true,
      data: {
        listing: carData,
        marketComparison,
        analysis,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Analysis error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to analyze car listing',
      details: 'Please check the URL and try again.'
    });
  }
});

// Helper functions for analysis
function generatePros(carData, marketComparison) {
  const pros = [];
  
  if (carData.price < marketComparison.averagePrice) {
    pros.push('Below market average price');
  }
  
  if (carData.mileage < 50000) {
    pros.push('Low mileage for age');
  }
  
  if (carData.year >= new Date().getFullYear() - 3) {
    pros.push('Recent model year');
  }
  
  if (carData.make && ['Toyota', 'Honda', 'Lexus', 'Acura'].includes(carData.make)) {
    pros.push('Reliable brand');
  }
  
  return pros.length > 0 ? pros : ['Vehicle appears to be in good condition'];
}

function generateCons(carData, marketComparison) {
  const cons = [];
  
  if (carData.price > marketComparison.averagePrice) {
    cons.push('Above market average price');
  }
  
  if (carData.mileage > 100000) {
    cons.push('High mileage');
  }
  
  if (carData.year < new Date().getFullYear() - 8) {
    cons.push('Older model year');
  }
  
  return cons.length > 0 ? cons : ['Limited information available'];
}

function generateReasoning(carData, marketComparison, dealScore) {
  const priceDiff = ((carData.price - marketComparison.averagePrice) / marketComparison.averagePrice) * 100;
  
  let reasoning = `This ${carData.year} ${carData.make} ${carData.model} is priced at $${carData.price.toLocaleString()}`;
  
  if (priceDiff < -10) {
    reasoning += `, which is ${Math.abs(Math.round(priceDiff))}% below the market average of $${marketComparison.averagePrice.toLocaleString()}. This represents an excellent value.`;
  } else if (priceDiff > 10) {
    reasoning += `, which is ${Math.round(priceDiff)}% above the market average of $${marketComparison.averagePrice.toLocaleString()}. Consider negotiating or looking elsewhere.`;
  } else {
    reasoning += `, which is close to the market average of $${marketComparison.averagePrice.toLocaleString()}. This is a fair price.`;
  }
  
  if (carData.mileage) {
    reasoning += ` With ${carData.mileage.toLocaleString()} miles, this vehicle has ${carData.mileage < 50000 ? 'low' : carData.mileage > 100000 ? 'high' : 'moderate'} mileage for its age.`;
  }
  
  reasoning += ` Overall deal score: ${dealScore}/100.`;
  
  return reasoning;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Universal Car Scraper API running on port ${PORT}`);
  console.log(`🔧 Zyte API: ${process.env.ZYTE_API_KEY ? '✅ Available' : '❌ Not configured'}`);
  console.log(`🤖 OpenAI API: ${process.env.OPENAI_API_KEY ? '✅ Available' : '❌ Not configured'}`);
}); 