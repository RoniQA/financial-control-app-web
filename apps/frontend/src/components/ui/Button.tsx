import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading = false, icon, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-gradient-primary text-white shadow-glow hover:shadow-large focus:ring-primary-500',
      secondary: 'bg-gradient-secondary text-white shadow-glow hover:shadow-large focus:ring-accent-500',
      success: 'bg-gradient-success text-white shadow-glow-success hover:shadow-large focus:ring-success-500',
      warning: 'bg-gradient-warm text-white shadow-glow-warning hover:shadow-large focus:ring-warning-500',
      danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-glow-danger hover:shadow-large focus:ring-danger-500',
      ghost: 'bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm text-secondary-700 dark:text-dark-text border border-white/20 dark:border-dark-border hover:bg-white dark:hover:bg-dark-surface2 hover:shadow-soft focus:ring-primary-500',
    }
    
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    }
    
    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
    
    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : icon ? (
          <span className="mr-2">{icon}</span>
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
