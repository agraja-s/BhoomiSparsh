import React from 'react'
import { Skeleton } from '../ui/Skeleton'
import { cn } from '../../utils/cn'

export interface LoadingStateProps {
  message?: string
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Processing request through API pipeline...',
  className,
}) => {
  return (
    <div className={cn('p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-4 text-left', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="w-1/3 h-4" />
          <p className="text-xs text-indigo-400 font-medium animate-pulse">{message}</p>
        </div>
      </div>
      <div className="space-y-2 pt-2 border-t border-slate-800/60">
        <Skeleton className="w-full h-8" />
        <Skeleton className="w-4/5 h-4" />
        <Skeleton className="w-2/3 h-4" />
      </div>
    </div>
  )
}
