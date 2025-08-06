# Zyte API Integration Setup Guide

## 🚀 Quick Start

This guide will help you set up Zyte API integration for reliable web scraping in the DealAnalyzer application.

## 1. Get Your Zyte API Key

### Sign Up for Zyte
1. Go to [Zyte.com](https://www.zyte.com/)
2. Click "Get Started" or "Sign Up"
3. Create your account
4. Navigate to your dashboard

### Get Your API Key
1. In your Zyte dashboard, find the "API Keys" section
2. Create a new API key
3. Copy the API key (it looks like: `abc123def456ghi789`)

## 2. Configure Your Environment

### Create Environment File
```bash
cd server
cp env.example .env
```

### Add Your API Key
Edit the `.env` file and add your Zyte API key:
```bash
# Required for web scraping
ZYTE_API_KEY=your_actual_api_key_here

# Optional market data APIs
KBB_API_KEY=
NADA_API_KEY=
EDMUNDS_API_KEY=
CARGURUS_API_KEY=
```

## 3. Test the Integration

### Start the Server
```bash
cd server
node test-server.js
```

### Test with Your Cars.com URL
```bash
# In another terminal
node test-scraper.js
```

## 4. How Zyte API Works

### What Zyte Does
- **JavaScript Rendering**: Executes JavaScript on web pages
- **Anti-Bot Protection**: Bypasses CAPTCHAs and bot detection
- **Proxy Rotation**: Uses different IP addresses
- **Rate Limiting**: Respects website rate limits
- **Error Handling**: Retries failed requests

### API Endpoint
```
POST https://api.zyte.com/v1/extract
```

### Request Format
```json
{
  "url": "https://www.cars.com/vehicledetail/...",
  "browserHtml": true,
  "javascript": true,
  "screenshot": false,
  "actions": [
    {
      "action": "wait",
      "selector": "body",
      "timeout": 5000
    }
  ]
}
```

## 5. Fallback System

If Zyte API fails, the system will:
1. **Extract from URL**: Parse make/model from the URL itself
2. **Generate Realistic Data**: Create plausible car information
3. **Maintain User Experience**: Keep the app functional

### Example Fallback
For URL: `https://www.cars.com/vehicledetail/toyota-tacoma-2023/`
- Detects: Toyota + Tacoma + 2023
- Generates: Realistic price, mileage, location
- Result: Functional analysis with estimated data

## 6. Troubleshooting

### Common Issues

**Node.js Version Error**
```bash
# Error: File is not defined
# Solution: Upgrade to Node.js 20+
nvm install 20
nvm use 20
```

**API Key Not Found**
```bash
# Error: ZYTE_API_KEY not found
# Solution: Check your .env file
cat server/.env
```

**Zyte API Fails**
```bash
# Error: Zyte scraping error
# Solution: Check your API key and credits
# The system will fall back to URL extraction
```

### Testing Without Zyte
If you want to test without Zyte API:
1. Don't set `ZYTE_API_KEY` in `.env`
2. The system will use URL extraction fallback
3. You'll get simulated data based on URL patterns

## 7. Cost Considerations

### Zyte Pricing
- **Free Tier**: Limited requests per month
- **Paid Plans**: Pay per request
- **Enterprise**: Custom pricing

### Optimization Tips
- Cache results to avoid duplicate requests
- Use URL extraction for known patterns
- Implement request batching

## 8. Production Deployment

### Environment Variables
```bash
# Required
ZYTE_API_KEY=your_production_key

# Optional
NODE_ENV=production
PORT=3001
```

### Security
- Never commit API keys to version control
- Use environment variables in production
- Rotate API keys regularly

## 9. Monitoring

### Logs to Watch
```bash
# Successful scraping
🚀 Starting Zyte scrape for URL: https://...
📄 Zyte response status: 200
✅ Cars.com scraping result: {...}

# Fallback to URL extraction
❌ Zyte scraping error: ...
🔄 Falling back to URL extraction
✅ Extracted from URL: {...}
```

### Health Check
```bash
curl http://localhost:3001/health
```

## 10. Next Steps

Once Zyte is working:
1. **Test with real URLs**: Try different car listing sites
2. **Monitor costs**: Track your Zyte API usage
3. **Optimize selectors**: Fine-tune scraping for better accuracy
4. **Add more sites**: Extend support for additional car listing platforms

## Support

- **Zyte Documentation**: [docs.zyte.com](https://docs.zyte.com/)
- **Zyte Support**: Available through your dashboard
- **Project Issues**: Open an issue on GitHub

---

**Note**: Zyte API is a paid service. Make sure to understand the pricing before using in production. 