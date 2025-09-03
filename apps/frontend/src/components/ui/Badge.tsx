import { HTMLAttributes, forwardRef } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', size = 'md', rounded = true, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center font-medium transition-all duration-200'
    
    const variants = {
      default: 'bg-primary-100 text-primary-800 border border-primary-200',
      success: 'bg-success-100 text-success-800 border border-success-200',
      warning: 'bg-warning-100 text-warning-800 border border-warning-200',
      danger: 'bg-danger-100 text-danger-800 border border-danger-200',
      info: 'bg-accent-100 text-accent-800 border border-accent-200',
      secondary: 'bg-secondary-100 text-secondary-800 border border-secondary-200',
    }
    
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    }
    
    const roundedClasses = rounded ? 'rounded-full' : 'rounded-lg'
    
    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${roundedClasses} ${className}`
    
    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
