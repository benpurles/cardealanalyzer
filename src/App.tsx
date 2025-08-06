import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, TrendingUp, AlertTriangle, CheckCircle, Loader2, Sparkles } from 'lucide-react'
import DealAnalyzer from './components/DealAnalyzer'
import DealReport from './components/DealReport'
import { DealAnalysis } from './types'

function App() {
  const [analysis, setAnalysis] = useState<DealAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalysisComplete = (result: DealAnalysis) => {
    setAnalysis(result)
    setIsAnalyzing(false)
  }

  const handleNewAnalysis = () => {
    setAnalysis(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="safe-area-top glass-effect sticky top-0 z-50"
      >
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-primary-500 rounded-2xl">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">DealAnalyzer</h1>
              <p className="text-sm text-gray-600">AI-Powered Car Deal Analysis</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div
              key="analyzer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <DealAnalyzer 
                onAnalysisComplete={handleAnalysisComplete}
                isAnalyzing={isAnalyzing}
                setIsAnalyzing={setIsAnalyzing}
              />
            </motion.div>
          ) : (
            <motion.div
              key="report"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <DealReport 
                analysis={analysis}
                onNewAnalysis={handleNewAnalysis}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 shadow-large max-w-sm mx-4"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4"
                >
                  <Loader2 className="w-6 h-6 text-primary-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Analyzing Deal
                </h3>
                <p className="text-gray-600 text-sm">
                  Our AI is examining the listing and comparing it to market data...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App 