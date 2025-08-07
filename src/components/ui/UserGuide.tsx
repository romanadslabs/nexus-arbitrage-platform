'use client'

import React, { useState } from 'react'

interface UserGuideProps {
  title: string
  description: string
  steps: Array<{
    title: string
    description: string
    icon: string
  }>
  tips?: Array<{
    title: string
    content: string
    type: 'info' | 'warning' | 'success'
  }>
}

export default function UserGuide({ title, description, steps, tips = [] }: UserGuideProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            💡 {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          {isExpanded ? 'Сховати' : 'Показати'} деталі
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Steps */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📋 Покрокова інструкція
            </h4>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-2xl">{step.icon}</span>
                      <h5 className="font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </h5>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          {tips.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                💡 Корисні поради
              </h4>
              <div className="space-y-3">
                {tips.map((tip, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      tip.type === 'info'
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                        : tip.type === 'warning'
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                        : 'bg-green-50 dark:bg-green-900/20 border-green-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">
                        {tip.type === 'info' ? 'ℹ️' : tip.type === 'warning' ? '⚠️' : '✅'}
                      </span>
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {tip.title}
                        </h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {tip.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 