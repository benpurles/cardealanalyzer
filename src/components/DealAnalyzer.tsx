import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, Sparkles, AlertCircle } from 'lucide-react'
import { DealAnalysis } from '../types'
import { analyzeCarDeal } from '../services/analysisService'

interface DealAnalyzerProps {
  onAnalysisComplete: (analysis: DealAnalysis) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void
}

const DealAnalyzer: React.FC<DealAnalyzerProps> = ({
  onAnalysisComplete,
  isAnalyzing,
  setIsAnalyzing
}) => {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setError('Please enter a car listing URL')
      return
    }

    if (!url.includes('http')) {
      setError('Please enter a valid URL starting with http:// or https://')
      return
    }

    setError('')
    setIsAnalyzing(true)

    try {
      const analysis = await analyzeCarDeal(url)
      onAnalysisComplete(analysis)
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze the listing. Please check the URL and try again.';
      setError(errorMessage);
      setIsAnalyzing(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-large"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Analyze Your Car Deal
          </h2>
          <p className="text-gray-600">
            Paste a car listing URL and get an AI-powered analysis with market comparisons
          </p>
        </div>
      </div>

      {/* URL Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-effect rounded-3xl p-6 card-shadow"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
              Car Listing URL
            </label>
            <div className="relative">
              <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.cars.com/listing/..."
                className="input-field pl-12"
                disabled={isAnalyzing}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center space-x-2 p-3 bg-danger-50 border border-danger-200 rounded-2xl"
            >
              <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />
              <span className="text-sm text-danger-700">{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isAnalyzing}
            className="button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Deal'}
          </button>
        </form>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-900 text-center">
          What You'll Get
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {[
            {
              icon: '📊',
              title: 'Market Analysis',
              description: 'Compare with similar vehicles in your area'
            },
            {
              icon: '💰',
              title: 'Price Evaluation',
              description: 'See if the price is fair or overpriced'
            },
            {
              icon: '🤖',
              title: 'AI Insights',
              description: 'Get detailed reasoning and recommendations'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-white rounded-2xl card-shadow"
            >
              <div className="text-2xl">{feature.icon}</div>
              <div>
                <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DealAnalyzer 