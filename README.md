# DealAnalyzer - AI-Powered Car Deal Analysis

A modern web application that analyzes car listings using AI to determine if they're good deals. Built with React, TypeScript, and Tailwind CSS with an iPhone 15-style design.

## Features

- 🚗 **Real Web Scraping**: Actually scrapes car listing URLs from major sites
- 🤖 **AI-Powered Insights**: Get detailed reasoning and recommendations
- 📊 **Market Comparison**: Compare prices with similar vehicles
- 💰 **Deal Scoring**: 0-100 score with clear recommendations
- 📱 **Mobile-First Design**: Beautiful iPhone 15-style interface
- ⚡ **Real-time Analysis**: Fast, responsive analysis with loading states
- 🔄 **Fallback System**: Graceful degradation when scraping fails

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Node.js + Express
- **Scraping**: Zyte API + Cheerio + Axios
- **Styling**: Tailwind CSS + Framer Motion
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Design**: iPhone 15-style UI with glass morphism effects

## Getting Started

### Prerequisites

- Node.js 20+ (required for latest dependencies)
- npm or yarn
- Zyte API key (sign up at [Zyte.com](https://www.zyte.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DealAnalyzer
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cd server
   cp env.example .env
   # Edit .env with your Zyte API key (required)
   # Add optional market data API keys
   ```

5. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

6. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Troubleshooting Node.js Version Issues

If you encounter Node.js version errors, you have two options:

**Option 1: Upgrade Node.js (Recommended)**
```bash
# Using nvm (Node Version Manager)
nvm install 20
nvm use 20

# Or download from nodejs.org
```

**Option 2: Use older dependencies (Temporary fix)**
```bash
cd server
npm install cheerio@1.0.0-rc.12 axios@1.4.0
```

### Building for Production

```bash
npm run build
```

## Usage

1. **Enter a Car Listing URL**: Paste any car listing URL from popular sites like Cars.com, AutoTrader, etc.

2. **Wait for Analysis**: The AI will analyze the listing and compare it to market data

3. **Review Results**: Get a comprehensive report including:
   - Deal score (0-100)
   - Price comparison with market average
   - Pros and cons
   - AI reasoning
   - Final recommendation

## How It Works

The application uses Zyte API for reliable web scraping and AI-powered analysis:

1. **Web Scraping**: Uses Zyte API to extract car data from listing URLs
   - **Zyte API**: Handles JavaScript rendering, anti-bot protection, and proxy rotation
   - Supports Cars.com, AutoTrader, CarGurus, CarMax, Edmunds
   - Generic scraper for unknown sites
   - Extracts price, year, make, model, mileage, location, images
   - **Fallback**: If Zyte fails, extracts data from URL patterns

2. **Market Data**: Fetches real market comparisons
   - Tries multiple APIs (Kelley Blue Book, NADA, Edmunds, CarGurus)
   - Falls back to realistic mock data if APIs unavailable
   - Caches results for performance

3. **AI Analysis**: Comprehensive deal scoring algorithm:
   - Price vs. market average (40% weight)
   - Mileage comparison (20% weight)
   - Market trends (10% weight)
   - Location desirability (10% weight)
   - Vehicle age (10% weight)
   - Brand reliability (10% weight)

4. **Smart Fallback**: If scraping fails, uses intelligent simulation
   - Maintains realistic data based on URL keywords
   - Provides consistent user experience
   - Logs errors for debugging

## Project Structure

```
├── src/                    # Frontend React app
│   ├── components/         # React components
│   │   ├── DealAnalyzer.tsx # Main input form
│   │   └── DealReport.tsx   # Analysis results display
│   ├── services/           # Frontend services
│   │   └── analysisService.ts # API client with fallback
│   ├── types.ts           # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── server/                # Backend API server
│   ├── scrapers/          # Web scraping modules
│   │   └── carScraper.js  # Main scraper for car sites
│   ├── services/          # Backend services
│   │   ├── marketDataService.js # Market data fetching
│   │   └── analysisService.js   # AI analysis logic
│   ├── server.js          # Express server setup
│   ├── package.json       # Backend dependencies
│   └── env.example        # Environment variables template
└── package.json           # Frontend dependencies
```

## Design Features

- **iPhone 15 Style**: Modern, rounded corners and glass morphism effects
- **Responsive Design**: Optimized for mobile and desktop
- **Smooth Animations**: Framer Motion powered transitions
- **Color System**: Consistent primary/secondary color palette
- **Typography**: Clean, readable font hierarchy

## Supported Websites

The scraper currently supports:
- **Cars.com** - Full support for vehicle data extraction
- **AutoTrader.com** - Price, specs, and location data
- **CarGurus.com** - Comprehensive listing information
- **CarMax.com** - Used car inventory data
- **Edmunds.com** - Vehicle reviews and pricing
- **Generic Sites** - Fallback scraper for unknown sites

## API Integration

### Required API Key:
- **Zyte API** - Set `ZYTE_API_KEY` in environment (required for web scraping)
  - Sign up at [Zyte.com](https://www.zyte.com/)
  - Get your API key from the dashboard
  - Add to `.env` file: `ZYTE_API_KEY=your_api_key_here`

### Optional Market Data APIs:
- **Kelley Blue Book** - Set `KBB_API_KEY` in environment
- **NADA Guides** - Set `NADA_API_KEY` in environment  
- **Edmunds** - Set `EDMUNDS_API_KEY` in environment
- **CarGurus** - Set `CARGURUS_API_KEY` in environment

Without market API keys, the app uses realistic fallback data.

## Future Enhancements

- [ ] Puppeteer integration for JavaScript-heavy sites
- [ ] User accounts and analysis history
- [ ] Email notifications for price drops
- [ ] Advanced filtering and search
- [ ] Export reports to PDF
- [ ] Mobile app version
- [ ] More car listing sites support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support, please open an issue on GitHub. 

For questions or support, please open an issue on GitHub. 