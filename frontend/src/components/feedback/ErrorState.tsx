import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

export interface ErrorStateProps {
  title?: string
  message: string
  code?: string
  onRetry?: () => void
  isRetrying?: boolean
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Operation Encountered an Error',
  message,
  code,
  onRetry,
  isRetrying = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-200 text-left space-y-3',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-rose-100">{title}</h4>
            {code && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-900/50 border border-rose-800 text-rose-300">
                {code}
              </span>
            )}
          </div>
          <p className="text-xs text-rose-300/90 leading-relaxed">{message}</p>
        </div>
      </div>
      {onRetry && (
        <div className="pt-1 flex justify-end">
          <Button
            size="sm"
            variant="destructive"
            onClick={onRetry}
            isLoading={isRetrying}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Retry Request
          </Button>
        </div>
      )}
    </div>
  )
}
