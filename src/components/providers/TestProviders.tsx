'use client'

import React, { createContext, useContext, useState } from 'react'

// Спрощений контекст для тестування
interface TestContextType {
  isWorking: boolean
  toggleWorking: () => void
}

const TestContext = createContext<TestContextType | undefined>(undefined)

export function TestProvider({ children }: { children: React.ReactNode }) {
  const [isWorking, setIsWorking] = useState(true)

  const toggleWorking = () => {
    setIsWorking(!isWorking)
  }

  return (
    <TestContext.Provider value={{ isWorking, toggleWorking }}>
      {children}
    </TestContext.Provider>
  )
}

export function useTest() {
  const context = useContext(TestContext)
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider')
  }
  return context
} 