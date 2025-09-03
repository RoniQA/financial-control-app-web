import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', padding = 'md', hover = false, children, ...props }, ref) => {
    const baseClasses = 'rounded-2xl transition-all duration-300'
    
    const variants = {
      default: 'bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl border border-white/20 dark:border-dark-border shadow-soft',
      elevated: 'bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl border border-white/20 dark:border-dark-border shadow-large',
      outlined: 'bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm border-2 border-white/30 dark:border-dark-border shadow-soft',
      glass: 'bg-white/40 dark:bg-dark-surface/40 backdrop-blur-xl border border-white/20 dark:border-dark-border shadow-soft',
    }
    
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }
    
    const hoverClasses = hover ? 'hover:shadow-large hover:scale-[1.02] hover:-translate-y-1' : ''
    
    const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${hoverClasses} ${className}`
    
    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`mb-6 ${className}`} {...props} />
  )
)

CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', ...props }, ref) => (
    <h3 ref={ref} className={`text-xl font-semibold text-secondary-900 dark:text-dark-text ${className}`} {...props} />
  )
)

CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <p ref={ref} className={`text-sm text-secondary-600 dark:text-dark-textSecondary mt-1 ${className}`} {...props} />
  )
)

CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={className} {...props} />
  )
)

CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`mt-6 pt-6 border-t border-white/20 dark:border-dark-border ${className}`} {...props} />
  )
)

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
