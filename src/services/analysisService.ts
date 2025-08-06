import { DealAnalysis, CarListing, MarketComparison } from '../types'

// Real API service for car deal analysis
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Simulated car data for market comparison (fallback)
const mockCarData = {
  'toyota-camry': {
    averagePrice: 25000,
    priceRange: { min: 22000, max: 28000 },
    marketTrend: 'stable' as const,
    similarListings: [
      { price: 24500, mileage: 45000, location: 'Los Angeles, CA', url: '#' },
      { price: 26000, mileage: 38000, location: 'San Francisco, CA', url: '#' },
      { price: 23500, mileage: 52000, location: 'San Diego, CA', url: '#' },
    ]
  },
  'honda-civic': {
    averagePrice: 22000,
    priceRange: { min: 19000, max: 25000 },
    marketTrend: 'increasing' as const,
    similarListings: [
      { price: 22500, mileage: 42000, location: 'Los Angeles, CA', url: '#' },
      { price: 21000, mileage: 48000, location: 'San Francisco, CA', url: '#' },
      { price: 23500, mileage: 35000, location: 'San Diego, CA', url: '#' },
    ]
  },
  'ford-f-150': {
    averagePrice: 45000,
    priceRange: { min: 40000, max: 50000 },
    marketTrend: 'decreasing' as const,
    similarListings: [
      { price: 44000, mileage: 35000, location: 'Los Angeles, CA', url: '#' },
      { price: 46000, mileage: 28000, location: 'San Francisco, CA', url: '#' },
      { price: 42000, mileage: 42000, location: 'San Diego, CA', url: '#' },
    ]
  },
  'bmw-3-series': {
    averagePrice: 35000,
    priceRange: { min: 30000, max: 40000 },
    marketTrend: 'stable' as const,
    similarListings: [
      { price: 34500, mileage: 38000, location: 'Los Angeles, CA', url: '#' },
      { price: 36000, mileage: 32000, location: 'San Francisco, CA', url: '#' },
      { price: 33000, mileage: 45000, location: 'San Diego, CA', url: '#' },
    ]
  }
}

// Extract car information from URL (simulated)
const extractCarInfo = (url: string): CarListing => {
  // Simulate URL parsing and data extraction
  const urlLower = url.toLowerCase()
  
  let make = 'Toyota'
  let model = 'Camry'
  let year = 2020
  let price = 25000
  let mileage = 45000
  let location = 'Los Angeles, CA'
  
  if (urlLower.includes('honda') || urlLower.includes('civic')) {
    make = 'Honda'
    model = 'Civic'
    price = 22000
    mileage = 42000
  } else if (urlLower.includes('ford') || urlLower.includes('f-150')) {
    make = 'Ford'
    model = 'F-150'
    price = 45000
    mileage = 35000
  } else if (urlLower.includes('bmw') || urlLower.includes('3-series')) {
    make = 'BMW'
    model = '3 Series'
    price = 35000
    mileage = 38000
  }
  
  // Simulate some price variation
  const priceVariation = Math.random() * 0.4 - 0.2 // ±20%
  price = Math.round(price * (1 + priceVariation))
  
  // Simulate mileage variation
  const mileageVariation = Math.random() * 0.3 - 0.15 // ±15%
  mileage = Math.round(mileage * (1 + mileageVariation))
  
  return {
    url,
    title: `${year} ${make} ${model}`,
    price,
    year,
    make,
    model,
    mileage,
    location,
    description: `Well-maintained ${year} ${make} ${model} with ${mileage.toLocaleString()} miles. Excellent condition with clean history.`,
    images: ['https://via.placeholder.com/400x300/0ea5e9/ffffff?text=Car+Image']
  }
}

// Get market comparison data
const getMarketComparison = (make: string, model: string): MarketComparison => {
  const key = `${make.toLowerCase()}-${model.toLowerCase().replace(' ', '-')}`
  const data = mockCarData[key as keyof typeof mockCarData] || mockCarData['toyota-camry']
  
  return {
    ...data,
    similarListings: data.similarListings.map(listing => ({
      ...listing,
      url: `https://example.com/listing/${Math.random().toString(36).substr(2, 9)}`
    }))
  }
}

// Calculate deal score and analysis
const calculateDealAnalysis = (listing: CarListing, marketComparison: MarketComparison) => {
  const priceDifference = listing.price - marketComparison.averagePrice
  const percentageDifference = (priceDifference / marketComparison.averagePrice) * 100
  
  // Base score starts at 50
  let score = 50
  
  // Price factor (40% of score)
  if (percentageDifference <= -10) {
    score += 20 // Great deal
  } else if (percentageDifference <= -5) {
    score += 15 // Good deal
  } else if (percentageDifference <= 0) {
    score += 10 // Fair deal
  } else if (percentageDifference <= 10) {
    score -= 10 // Slightly overpriced
  } else {
    score -= 20 // Overpriced
  }
  
  // Mileage factor (20% of score)
  const avgMileage = marketComparison.similarListings.reduce((sum, l) => sum + l.mileage, 0) / marketComparison.similarListings.length
  const mileageDifference = ((listing.mileage - avgMileage) / avgMileage) * 100
  
  if (mileageDifference <= -20) {
    score += 10 // Low mileage
  } else if (mileageDifference <= -10) {
    score += 5 // Below average mileage
  } else if (mileageDifference >= 20) {
    score -= 10 // High mileage
  } else if (mileageDifference >= 10) {
    score -= 5 // Above average mileage
  }
  
  // Market trend factor (10% of score)
  if (marketComparison.marketTrend === 'decreasing') {
    score += 5 // Good time to buy
  } else if (marketComparison.marketTrend === 'increasing') {
    score -= 5 // Prices going up
  }
  
  // Location factor (10% of score)
  const isDesirableLocation = ['Los Angeles, CA', 'San Francisco, CA', 'San Diego, CA'].includes(listing.location)
  if (isDesirableLocation) {
    score += 5
  }
  
  // Year factor (10% of score)
  const currentYear = new Date().getFullYear()
  const age = currentYear - listing.year
  if (age <= 2) {
    score += 5 // Very recent
  } else if (age <= 4) {
    score += 2 // Recent
  } else if (age >= 8) {
    score -= 5 // Older
  }
  
  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, Math.round(score)))
  
  // Determine recommendation
  let recommendation: 'excellent' | 'good' | 'fair' | 'poor'
  if (score >= 80) recommendation = 'excellent'
  else if (score >= 60) recommendation = 'good'
  else if (score >= 40) recommendation = 'fair'
  else recommendation = 'poor'
  
  // Generate reasoning
  const reasoning: string[] = []
  if (percentageDifference <= -10) {
    reasoning.push(`This vehicle is priced ${Math.abs(percentageDifference).toFixed(1)}% below market average, making it an attractive deal.`)
  } else if (percentageDifference >= 10) {
    reasoning.push(`This vehicle is priced ${percentageDifference.toFixed(1)}% above market average, which may not be the best value.`)
  } else {
    reasoning.push(`The price is within ${Math.abs(percentageDifference).toFixed(1)}% of market average, which is reasonable.`)
  }
  
  if (mileageDifference <= -20) {
    reasoning.push(`With ${Math.abs(mileageDifference).toFixed(1)}% fewer miles than similar vehicles, this car shows less wear and tear.`)
  } else if (mileageDifference >= 20) {
    reasoning.push(`This vehicle has ${mileageDifference.toFixed(1)}% more miles than similar listings, which may affect its value.`)
  }
  
  if (marketComparison.marketTrend === 'decreasing') {
    reasoning.push(`Market prices for this model are trending downward, making it a good time to purchase.`)
  } else if (marketComparison.marketTrend === 'increasing') {
    reasoning.push(`Market prices for this model are increasing, so waiting might result in higher prices.`)
  }
  
  // Generate pros and cons
  const pros: string[] = []
  const cons: string[] = []
  
  if (percentageDifference <= -5) pros.push('Priced below market average')
  if (percentageDifference >= 5) cons.push('Priced above market average')
  
  if (mileageDifference <= -10) pros.push('Lower mileage than average')
  if (mileageDifference >= 10) cons.push('Higher mileage than average')
  
  if (age <= 3) pros.push('Recent model year')
  if (age >= 6) cons.push('Older model year')
  
  if (isDesirableLocation) pros.push('Desirable location')
  
  if (marketComparison.marketTrend === 'decreasing') pros.push('Favorable market conditions')
  if (marketComparison.marketTrend === 'increasing') cons.push('Rising market prices')
  
  // Generate final verdict
  let finalVerdict = ''
  if (recommendation === 'excellent') {
    finalVerdict = 'This is an excellent deal! Strong value for the price with favorable market conditions.'
  } else if (recommendation === 'good') {
    finalVerdict = 'This is a good deal with fair pricing and reasonable value for your money.'
  } else if (recommendation === 'fair') {
    finalVerdict = 'This is a fair deal, but you might want to negotiate or consider other options.'
  } else {
    finalVerdict = 'This deal may not offer the best value. Consider negotiating or looking elsewhere.'
  }
  
  return {
    dealScore: score,
    recommendation,
    reasoning,
    priceAnalysis: {
      isOverpriced: priceDifference > 0,
      priceDifference,
      percentageDifference
    },
    pros,
    cons,
    finalVerdict
  }
}

// Main analysis function
export const analyzeCarDeal = async (url: string): Promise<DealAnalysis> => {
  try {
    console.log('🚀 Starting car deal analysis for URL:', url);
    console.log('🔗 API Base URL:', API_BASE_URL);
    
    // Call the real API with our new endpoint
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    })

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const result = await response.json()
    
    console.log('📊 Raw API result:', result);
    
    if (!result.success) {
      throw new Error(result.error || 'Analysis failed')
    }

    console.log('✅ API call successful, returning real data');
    console.log('🚗 Vehicle:', result.data.listing.title);
    console.log('💰 Price:', result.data.listing.price);
    
    // Transform the API response to match our DealAnalysis interface
    const transformedData: DealAnalysis = {
      listing: result.data.listing,
      marketComparison: {
        averagePrice: result.data.marketComparison.averagePrice,
        priceRange: {
          min: result.data.marketComparison.priceRange.low,
          max: result.data.marketComparison.priceRange.high
        },
        marketTrend: result.data.marketComparison.marketTrend,
        similarListings: [] // The API doesn't provide individual similar listings
      },
      dealScore: result.data.analysis.dealScore,
      recommendation: result.data.analysis.recommendation === 'Buy' ? 'good' : 
                      result.data.analysis.recommendation === 'Consider' ? 'fair' : 'poor',
      reasoning: [result.data.analysis.reasoning],
      priceAnalysis: {
        isOverpriced: result.data.analysis.priceAnalysis.priceDifference > 0,
        priceDifference: result.data.analysis.priceAnalysis.priceDifference,
        percentageDifference: (result.data.analysis.priceAnalysis.priceDifference / result.data.marketComparison.averagePrice) * 100
      },
      pros: result.data.analysis.pros || [],
      cons: result.data.analysis.cons || [],
      finalVerdict: result.data.analysis.reasoning || 'Analysis completed successfully',
      timestamp: new Date(result.data.analysis.timestamp)
    };
    
    console.log('🔄 Transformed data for frontend:', transformedData);
    return transformedData;
    
  } catch (error) {
    console.error('❌ API call failed:', error);
    console.error('❌ Error details:', error.message);
    
    // Throw the error instead of falling back to demo data
    throw new Error(`Failed to analyze car listing: ${error.message}. Please check the URL and try again.`);
  }
} 