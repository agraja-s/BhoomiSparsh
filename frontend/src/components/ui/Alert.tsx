import React from 'react'
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'destructive'
  title?: string
  action?: React.ReactNode
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'info',
  title,
  action,
  children,
  ...props
}) => {
  const icons = {
    info: <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
    destructive: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />,
  }

  const variantStyles = {
    info: 'bg-sky-500/10 border-sky-500/25 text-sky-200',
    success: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200',
    warning: 'bg-amber-500/10 border-amber-500/25 text-amber-200',
    destructive: 'bg-rose-500/10 border-rose-500/25 text-rose-200',
  }

  return (
    <div
      role="alert"
      className={cn('flex items-start gap-3 p-4 rounded-xl border text-sm', variantStyles[variant], className)}
      {...props}
    >
      {icons[variant]}
      <div className="flex-1 space-y-1">
        {title && <h5 className="font-semibold leading-tight text-white">{title}</h5>}
        <div className="text-xs text-slate-300 leading-relaxed">{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
