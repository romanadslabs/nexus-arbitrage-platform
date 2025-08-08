'use client'

import React from 'react'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  account?: any
  statuses?: any[]
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Тимчасово недоступно
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Цей компонент тимчасово недоступний. Ведуться технічні роботи.
        </p>
      </div>
    </div>
  )
} 