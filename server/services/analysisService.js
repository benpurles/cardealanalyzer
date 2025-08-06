class AnalysisService {
  constructor() {
    this.analysisCache = new Map();
  }

  async analyzeDeal(carData, marketData) {
    const cacheKey = `${carData.url}-${carData.price}-${carData.mileage}`;
    
    // Check cache first
    const cached = this.analysisCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 60 * 60 * 1000) { // 1 hour cache
      return cached.data;
    }

    // Perform comprehensive analysis
    const analysis = this.performAnalysis(carData, marketData);
    
    // Cache the result
    this.analysisCache.set(cacheKey, {
      data: analysis,
      timestamp: Date.now()
    });

    return analysis;
  }

  performAnalysis(carData, marketData) {
    const priceDifference = carData.price - marketData.averagePrice;
    const percentageDifference = (priceDifference / marketData.averagePrice) * 100;
    
    // Calculate deal score (0-100)
    const score = this.calculateDealScore(carData, marketData, percentageDifference);
    
    // Determine recommendation
    const recommendation = this.determineRecommendation(score);
    
    // Generate reasoning
    const reasoning = this.generateReasoning(carData, marketData, percentageDifference);
    
    // Generate pros and cons
    const { pros, cons } = this.generateProsAndCons(carData, marketData, percentageDifference);
    
    // Generate final verdict
    const finalVerdict = this.generateFinalVerdict(recommendation, score, percentageDifference);
    
    return {
      listing: carData,
      marketComparison: marketData,
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
      finalVerdict,
      timestamp: new Date()
    };
  }

  calculateDealScore(carData, marketData, percentageDifference) {
    let score = 50; // Base score
    
    // Price factor (40% weight)
    if (percentageDifference <= -15) {
      score += 25; // Excellent deal
    } else if (percentageDifference <= -10) {
      score += 20; // Great deal
    } else if (percentageDifference <= -5) {
      score += 15; // Good deal
    } else if (percentageDifference <= 0) {
      score += 10; // Fair deal
    } else if (percentageDifference <= 10) {
      score -= 10; // Slightly overpriced
    } else if (percentageDifference <= 20) {
      score -= 20; // Overpriced
    } else {
      score -= 30; // Very overpriced
    }
    
    // Mileage factor (20% weight)
    const avgMileage = marketData.similarListings.reduce((sum, l) => sum + l.mileage, 0) / marketData.similarListings.length;
    const mileageDifference = ((carData.mileage - avgMileage) / avgMileage) * 100;
    
    if (mileageDifference <= -30) {
      score += 15; // Very low mileage
    } else if (mileageDifference <= -20) {
      score += 10; // Low mileage
    } else if (mileageDifference <= -10) {
      score += 5; // Below average mileage
    } else if (mileageDifference >= 30) {
      score -= 15; // Very high mileage
    } else if (mileageDifference >= 20) {
      score -= 10; // High mileage
    } else if (mileageDifference >= 10) {
      score -= 5; // Above average mileage
    }
    
    // Market trend factor (10% weight)
    if (marketData.marketTrend === 'decreasing') {
      score += 8; // Good time to buy
    } else if (marketData.marketTrend === 'increasing') {
      score -= 8; // Prices going up
    }
    
    // Vehicle age factor (10% weight)
    const currentYear = new Date().getFullYear();
    const age = currentYear - carData.year;
    
    if (age <= 1) {
      score += 8; // Very recent
    } else if (age <= 3) {
      score += 5; // Recent
    } else if (age <= 5) {
      score += 2; // Fairly recent
    } else if (age >= 10) {
      score -= 8; // Older
    } else if (age >= 7) {
      score -= 5; // Getting older
    }
    
    // Location factor (10% weight)
    const isDesirableLocation = this.isDesirableLocation(carData.location);
    if (isDesirableLocation) {
      score += 5;
    }
    
    // Brand reliability factor (10% weight)
    const reliabilityScore = this.getBrandReliabilityScore(carData.make);
    score += reliabilityScore;
    
    // Clamp score between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  determineRecommendation(score) {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }

  generateReasoning(carData, marketData, percentageDifference) {
    const reasoning = [];
    
    // Price reasoning
    if (percentageDifference <= -15) {
      reasoning.push(`This vehicle is priced ${Math.abs(percentageDifference).toFixed(1)}% below market average, representing an exceptional value opportunity.`);
    } else if (percentageDifference <= -10) {
      reasoning.push(`This vehicle is priced ${Math.abs(percentageDifference).toFixed(1)}% below market average, making it an attractive deal.`);
    } else if (percentageDifference <= -5) {
      reasoning.push(`This vehicle is priced ${Math.abs(percentageDifference).toFixed(1)}% below market average, offering good value.`);
    } else if (percentageDifference >= 15) {
      reasoning.push(`This vehicle is priced ${percentageDifference.toFixed(1)}% above market average, which significantly reduces its value proposition.`);
    } else if (percentageDifference >= 10) {
      reasoning.push(`This vehicle is priced ${percentageDifference.toFixed(1)}% above market average, making it less attractive than similar options.`);
    } else if (percentageDifference >= 5) {
      reasoning.push(`This vehicle is priced ${percentageDifference.toFixed(1)}% above market average, which may not be the best value.`);
    } else {
      reasoning.push(`The price is within ${Math.abs(percentageDifference).toFixed(1)}% of market average, which is reasonable.`);
    }
    
    // Mileage reasoning
    const avgMileage = marketData.similarListings.reduce((sum, l) => sum + l.mileage, 0) / marketData.similarListings.length;
    const mileageDifference = ((carData.mileage - avgMileage) / avgMileage) * 100;
    
    if (mileageDifference <= -30) {
      reasoning.push(`With ${Math.abs(mileageDifference).toFixed(1)}% fewer miles than similar vehicles, this car shows significantly less wear and tear.`);
    } else if (mileageDifference <= -20) {
      reasoning.push(`With ${Math.abs(mileageDifference).toFixed(1)}% fewer miles than similar vehicles, this car shows less wear and tear.`);
    } else if (mileageDifference >= 30) {
      reasoning.push(`This vehicle has ${mileageDifference.toFixed(1)}% more miles than similar listings, which may affect its long-term reliability.`);
    } else if (mileageDifference >= 20) {
      reasoning.push(`This vehicle has ${mileageDifference.toFixed(1)}% more miles than similar listings, which may impact its value.`);
    }
    
    // Market trend reasoning
    if (marketData.marketTrend === 'decreasing') {
      reasoning.push(`Market prices for this model are trending downward, making it a favorable time to purchase.`);
    } else if (marketData.marketTrend === 'increasing') {
      reasoning.push(`Market prices for this model are increasing, so waiting might result in higher prices.`);
    }
    
    // Age reasoning
    const currentYear = new Date().getFullYear();
    const age = currentYear - carData.year;
    
    if (age <= 2) {
      reasoning.push(`This is a very recent model year (${age} year${age === 1 ? '' : 's'} old), which typically commands a premium.`);
    } else if (age >= 8) {
      reasoning.push(`This is an older model year (${age} years old), which may require more maintenance and have fewer modern features.`);
    }
    
    // Brand reasoning
    const reliabilityScore = this.getBrandReliabilityScore(carData.make);
    if (reliabilityScore > 0) {
      reasoning.push(`${carData.make} is known for reliability, which adds value to this vehicle.`);
    } else if (reliabilityScore < 0) {
      reasoning.push(`${carData.make} may have reliability concerns that could affect long-term ownership costs.`);
    }
    
    return reasoning;
  }

  generateProsAndCons(carData, marketData, percentageDifference) {
    const pros = [];
    const cons = [];
    
    // Price-based pros/cons
    if (percentageDifference <= -10) {
      pros.push('Significantly below market average');
    } else if (percentageDifference <= -5) {
      pros.push('Below market average');
    } else if (percentageDifference >= 10) {
      cons.push('Significantly above market average');
    } else if (percentageDifference >= 5) {
      cons.push('Above market average');
    }
    
    // Mileage-based pros/cons
    const avgMileage = marketData.similarListings.reduce((sum, l) => sum + l.mileage, 0) / marketData.similarListings.length;
    const mileageDifference = ((carData.mileage - avgMileage) / avgMileage) * 100;
    
    if (mileageDifference <= -20) {
      pros.push('Low mileage for its age');
    } else if (mileageDifference >= 20) {
      cons.push('High mileage for its age');
    }
    
    // Age-based pros/cons
    const currentYear = new Date().getFullYear();
    const age = currentYear - carData.year;
    
    if (age <= 3) {
      pros.push('Recent model year');
    } else if (age >= 8) {
      cons.push('Older model year');
    }
    
    // Market trend pros/cons
    if (marketData.marketTrend === 'decreasing') {
      pros.push('Favorable market conditions');
    } else if (marketData.marketTrend === 'increasing') {
      cons.push('Rising market prices');
    }
    
    // Location pros/cons
    if (this.isDesirableLocation(carData.location)) {
      pros.push('Desirable location');
    }
    
    // Brand pros/cons
    const reliabilityScore = this.getBrandReliabilityScore(carData.make);
    if (reliabilityScore > 0) {
      pros.push('Reliable brand');
    } else if (reliabilityScore < 0) {
      cons.push('Brand reliability concerns');
    }
    
    return { pros, cons };
  }

  generateFinalVerdict(recommendation, score, percentageDifference) {
    if (recommendation === 'excellent') {
      return 'This is an excellent deal! Strong value for the price with favorable market conditions and good vehicle characteristics.';
    } else if (recommendation === 'good') {
      return 'This is a good deal with fair pricing and reasonable value for your money.';
    } else if (recommendation === 'fair') {
      return 'This is a fair deal, but you might want to negotiate or consider other options.';
    } else {
      return 'This deal may not offer the best value. Consider negotiating or looking elsewhere.';
    }
  }

  isDesirableLocation(location) {
    const desirableLocations = [
      'los angeles', 'san francisco', 'san diego', 'new york', 'chicago',
      'miami', 'seattle', 'portland', 'denver', 'austin', 'dallas',
      'houston', 'phoenix', 'las vegas', 'atlanta', 'boston', 'washington'
    ];
    
    return desirableLocations.some(desirable => 
      location.toLowerCase().includes(desirable)
    );
  }

  getBrandReliabilityScore(make) {
    const reliabilityScores = {
      'Toyota': 8,
      'Honda': 8,
      'Lexus': 9,
      'Mazda': 7,
      'Subaru': 7,
      'BMW': 5,
      'Mercedes': 5,
      'Audi': 4,
      'Volkswagen': 4,
      'Ford': 6,
      'Chevrolet': 5,
      'Dodge': 3,
      'Jeep': 3,
      'Nissan': 5,
      'Hyundai': 6,
      'Kia': 6,
      'Acura': 7,
      'Infiniti': 5,
      'Buick': 6,
      'Cadillac': 4,
      'Lincoln': 5
    };
    
    const score = reliabilityScores[make] || 5;
    return (score - 5) * 2; // Convert to -10 to +10 scale
  }

  clearCache() {
    this.analysisCache.clear();
  }

  getCacheStats() {
    return {
      size: this.analysisCache.size,
      keys: Array.from(this.analysisCache.keys())
    };
  }
}

export default new AnalysisService(); 