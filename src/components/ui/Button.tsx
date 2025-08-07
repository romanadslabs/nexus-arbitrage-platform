'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  disabled?: boolean
  href?: string
  target?: string
  animate?: boolean
  shimmer?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-sm hover:shadow-md',
  outline: 'border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md',
  gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md'
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  href,
  target,
  animate = false,
  shimmer = false,
  className = '',
  onClick,
  type = 'button'
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${shimmer ? 'animate-shimmer' : ''}
    ${className}
  `

  const iconClasses = iconPosition === 'left' ? 'mr-2' : 'ml-2'
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' || size === 'xl' ? 'w-5 h-5' : 'w-4 h-4'

  const content = (
    <>
      {loading ? (
        <div className="animate-spin rounded-full border-2 border-current border-t-transparent w-4 h-4" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={`${iconClasses} ${iconSize}`} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={`${iconClasses} ${iconSize}`} />
          )}
        </>
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} target={target}>
        <motion.div
          className={baseClasses}
          whileHover={!disabled ? { scale: 1.02 } : undefined}
          whileTap={!disabled ? { scale: 0.98 } : undefined}
          initial={animate ? { opacity: 0, y: 20 } : undefined}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.2 }}
        >
          {content}
        </motion.div>
      </Link>
    )
  }

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {content}
    </motion.button>
  )
}

// Icon Button для компактних дій
interface IconButtonProps {
  icon: LucideIcon
  variant?: ButtonProps['variant']
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
  onClick?: () => void
  title?: string
}

export function IconButton({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  title
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <motion.button
      className={`
        ${sizeClasses[size]} rounded-lg inline-flex items-center justify-center
        ${variantClasses[variant]}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      whileHover={!disabled && !loading ? { scale: 1.05 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.95 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {loading ? (
        <div className="animate-spin rounded-full border-2 border-current border-t-transparent w-4 h-4" />
      ) : (
        <Icon className={iconSizes[size]} />
      )}
    </motion.button>
  )
}

// Floating Action Button
interface FloatingActionButtonProps {
  icon: LucideIcon
  onClick?: () => void
  variant?: ButtonProps['variant']
  size?: 'sm' | 'md' | 'lg'
  className?: string
  title?: string
}

export function FloatingActionButton({
  icon: Icon,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  title
}: FloatingActionButtonProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  }

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  }

  return (
    <motion.button
      className={`
        ${sizeClasses[size]} rounded-full shadow-lg inline-flex items-center justify-center
        ${variantClasses[variant]}
        fixed bottom-6 right-6 z-50
        ${className}
      `}
      onClick={onClick}
      title={title}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, type: 'spring' }}
    >
      <Icon className={iconSizes[size]} />
    </motion.button>
  )
} 