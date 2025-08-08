import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
  className?: string
  onClick?: () => void
}

export default function AnimatedCard({ 
  children, 
  delay = 0, 
  className = '',
  onClick 
}: AnimatedCardProps) {
  const prefersReducedMotion = useReducedMotion()
  if (prefersReducedMotion) {
    return <div className={className} onClick={onClick}>{children}</div>
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: delay * 0.1,
        ease: 'easeOut'
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={className}
      onClick={onClick}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
} 