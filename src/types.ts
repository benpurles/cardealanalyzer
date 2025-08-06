export interface CarListing {
  url: string
  title: string
  price: number
  year: number
  make: string
  model: string
  mileage: number
  location: string
  description: string
  images: string[]
}

export interface MarketComparison {
  averagePrice: number
  priceRange: {
    min: number
    max: number
  }
  similarListings: Array<{
    price: number
    mileage: number
    location: string
    url: string
  }>
  marketTrend: 'increasing' | 'decreasing' | 'stable'
}

export interface DealAnalysis {
  listing: CarListing
  marketComparison: MarketComparison
  dealScore: number // 0-100
  recommendation: 'excellent' | 'good' | 'fair' | 'poor'
  reasoning: string[]
  priceAnalysis: {
    isOverpriced: boolean
    priceDifference: number
    percentageDifference: number
  }
  pros: string[]
  cons: string[]
  finalVerdict: string
  timestamp: Date
}

export interface AnalysisRequest {
  url: string
} 