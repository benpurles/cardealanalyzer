import React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowLeft,
  Star,
  DollarSign,
  MapPin,
  Calendar,
  Gauge
} from 'lucide-react'
import { DealAnalysis } from '../types'

interface DealReportProps {
  analysis: DealAnalysis
  onNewAnalysis: () => void
}

const DealReport: React.FC<DealReportProps> = ({ analysis, onNewAnalysis }) => {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'excellent': return 'text-success-600 bg-success-50'
      case 'good': return 'text-primary-600 bg-primary-50'
      case 'fair': return 'text-warning-600 bg-warning-50'
      case 'poor': return 'text-danger-600 bg-danger-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'excellent': return <CheckCircle className="w-5 h-5" />
      case 'good': return <Star className="w-5 h-5" />
      case 'fair': return <Minus className="w-5 h-5" />
      case 'poor': return <XCircle className="w-5 h-5" />
      default: return <Minus className="w-5 h-5" />
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNewAnalysis}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">New Analysis</span>
        </button>
      </div>

      {/* Deal Score */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="glass-effect rounded-3xl p-6 card-shadow text-center"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            {getRecommendationIcon(analysis.recommendation)}
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRecommendationColor(analysis.recommendation)}`}>
              {analysis.recommendation.toUpperCase()} DEAL
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="text-4xl font-bold text-gray-900">
              {analysis.dealScore}/100
            </div>
            <div className="text-sm text-gray-600">
              Deal Score
            </div>
          </div>

          <div className="text-lg font-semibold text-gray-900">
            {analysis.finalVerdict}
          </div>
        </div>
      </motion.div>

      {/* Car Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect rounded-3xl p-6 card-shadow"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Price</span>
            <span className="font-semibold text-gray-900">{formatPrice(analysis.listing.price)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Vehicle</span>
            <span className="font-semibold text-gray-900">
              {analysis.listing.year} {analysis.listing.make} {analysis.listing.model}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Mileage</span>
            <span className="font-semibold text-gray-900">{formatMileage(analysis.listing.mileage)} mi</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Location</span>
            <span className="font-semibold text-gray-900">{analysis.listing.location}</span>
          </div>
        </div>
      </motion.div>

      {/* Price Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-3xl p-6 card-shadow"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Analysis</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Market Average</span>
            <span className="font-semibold text-gray-900">{formatPrice(analysis.marketComparison.averagePrice)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Price Difference</span>
            <div className="flex items-center space-x-1">
              {analysis.priceAnalysis.isOverpriced ? (
                <TrendingUp className="w-4 h-4 text-danger-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-success-500" />
              )}
              <span className={`font-semibold ${analysis.priceAnalysis.isOverpriced ? 'text-danger-600' : 'text-success-600'}`}>
                {formatPrice(Math.abs(analysis.priceAnalysis.priceDifference))}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Percentage</span>
            <span className={`font-semibold ${analysis.priceAnalysis.isOverpriced ? 'text-danger-600' : 'text-success-600'}`}>
              {analysis.priceAnalysis.percentageDifference > 0 ? '+' : ''}{analysis.priceAnalysis.percentageDifference.toFixed(1)}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Pros and Cons */}
      <div className="grid grid-cols-1 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-3xl p-6 card-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-success-500" />
            <span>Pros</span>
          </h3>
          <ul className="space-y-2">
            {analysis.pros.map((pro, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">{pro}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-3xl p-6 card-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-danger-500" />
            <span>Cons</span>
          </h3>
          <ul className="space-y-2">
            {analysis.cons.map((con, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-danger-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">{con}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Reasoning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-effect rounded-3xl p-6 card-shadow"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Reasoning</h3>
        <div className="space-y-3">
          {analysis.reasoning.map((reason, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-700">{reason}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DealReport 