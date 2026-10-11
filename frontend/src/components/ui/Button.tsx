import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'forest'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'forest',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99] cursor-pointer'

    const variantStyles = {
      forest: 'bg-[#1B5E20] hover:bg-[#2E7D32] text-white shadow-sm shadow-emerald-950/20 font-semibold',
      primary: 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm font-semibold',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200',
      outline: 'border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700',
      ghost: 'hover:bg-slate-100 text-slate-700 hover:text-slate-900',
      destructive: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm',
    }

    const sizeStyles = {
      sm: 'text-xs px-3 py-2 gap-1.5 min-h-[36px]',
      md: 'text-sm px-4 py-2.5 gap-2 min-h-[44px]',
      lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px] font-semibold',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
