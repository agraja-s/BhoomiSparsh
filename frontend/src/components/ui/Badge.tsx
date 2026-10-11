import React from 'react'
import { cn } from '../../utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'forest'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'outline'
    | 'mock'
    | 'risk-low'
    | 'risk-moderate'
    | 'risk-high'
    | 'inconclusive'
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  dot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    forest: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold',
    default: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    secondary: 'bg-slate-100 text-slate-800 border-slate-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    warning: 'bg-amber-100 text-amber-900 border-amber-300',
    destructive: 'bg-rose-100 text-rose-800 border-rose-300',
    outline: 'border-slate-300 text-slate-700 bg-white',
    mock: 'bg-amber-100 text-amber-900 border-amber-300 font-mono font-medium',
    'risk-low': 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold',
    'risk-moderate': 'bg-amber-100 text-amber-900 border-amber-400 font-semibold',
    'risk-high': 'bg-rose-100 text-rose-900 border-rose-400 font-semibold',
    inconclusive: 'bg-slate-100 text-slate-800 border-slate-300 font-semibold',
  }

  const dotColors = {
    forest: 'bg-emerald-700',
    default: 'bg-emerald-600',
    secondary: 'bg-slate-600',
    success: 'bg-emerald-600 animate-pulse',
    warning: 'bg-amber-600',
    destructive: 'bg-rose-600 animate-pulse',
    outline: 'bg-slate-500',
    mock: 'bg-amber-600',
    'risk-low': 'bg-emerald-700',
    'risk-moderate': 'bg-amber-600 animate-pulse',
    'risk-high': 'bg-rose-600 animate-pulse',
    inconclusive: 'bg-slate-500',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </div>
  )
}
