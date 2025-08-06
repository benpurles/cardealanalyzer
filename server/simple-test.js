// Simple test script to test scraping directly
import * as cheerio from 'cheerio';
import axios from 'axios';

async function testScraping() {
  try {
    const url = 'https://www.cars.com/vehicledetail/a5b56569-9451-4252-abe9-9e3ff8c23b60/';
    
    console.log('🚀 Testing scraping for:', url);
    
    // Fetch the page
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 10000
    });
    
    console.log('📄 Response status:', response.status);
    console.log('📄 Response length:', response.data.length);
    
    // Parse with Cheerio
    const $ = cheerio.load(response.data);
    
    // Try to extract data
    console.log('\n🔍 Testing various selectors:');
    
    // Title
    const title = $('h1').first().text().trim();
    console.log('📝 Title:', title);
    
    // Price
    const priceText = $('.price').text() || $('[class*="price"]').text();
    console.log('💰 Price text:', priceText);
    
    // Make/Model
    const makeText = $('.vehicle-make').text().trim() || $('[class*="make"]').text().trim();
    const modelText = $('.vehicle-model').text().trim() || $('[class*="model"]').text().trim();
    console.log('🚗 Make text:', makeText);
    console.log('🚗 Model text:', modelText);
    
    // Mileage
    const mileageText = $('.mileage').text() || $('[class*="mileage"]').text();
    console.log('📏 Mileage text:', mileageText);
    
    // Location
    const location = $('.dealer-location').text().trim() || $('[class*="location"]').text().trim();
    console.log('📍 Location:', location);
    
    // Let's also look at all h1 elements
    console.log('\n📋 All h1 elements:');
    $('h1').each((i, el) => {
      console.log(`  ${i + 1}. ${$(el).text().trim()}`);
    });
    
    // Let's look at elements with "price" in class
    console.log('\n💰 Elements with "price" in class:');
    $('[class*="price"]').each((i, el) => {
      console.log(`  ${i + 1}. ${$(el).text().trim()}`);
    });
    
    // Let's look at elements with "make" in class
    console.log('\n🚗 Elements with "make" in class:');
    $('[class*="make"]').each((i, el) => {
      console.log(`  ${i + 1}. ${$(el).text().trim()}`);
    });
    
    // Let's look at elements with "model" in class
    console.log('\n🚗 Elements with "model" in class:');
    $('[class*="model"]').each((i, el) => {
      console.log(`  ${i + 1}. ${$(el).text().trim()}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
  }
}

testScraping(); 