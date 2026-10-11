import React from 'react'
import {
  Send,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Clock,
  Hash,
  Terminal,
  Zap,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/feedback/EmptyState'
import { ErrorState } from '../../components/feedback/ErrorState'
import { LoadingState } from '../../components/feedback/LoadingState'
import { useDemoIntegration } from '../../hooks/useDemoIntegration'

export const DemoSection: React.FC = () => {
  const {
    query,
    validationError,
    isLoading,
    result,
    isMockResult,
    error,
    isMockMode,
    setQuery,
    executeProbe,
    handleRetry,
    handleReset,
  } = useDemoIntegration()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeProbe()
  }

  const handlePreset = (sampleText: string) => {
    setQuery(sampleText)
    executeProbe(sampleText)
  }

  return (
    <div className="space-y-6">
      {/* Feature Context Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Architecture Verification Probe
            </h2>
            <p className="text-xs text-slate-400">
              Temporary demonstration proving end-to-end form validation, service isolation, loading state, and response normalization.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isMockMode ? (
            <Badge variant="mock" dot>
              Active Adapter: Local Mock
            </Badge>
          ) : (
            <Badge variant="success" dot>
              Active Adapter: Live HTTP Client
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Form Controller */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Input Probe Payload</CardTitle>
                <span className="text-[11px] font-mono text-slate-500">POST /api/demo/probe</span>
              </div>
              <CardDescription>
                Provide a sample query string to dispatch through the architecture pipeline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Probe Query String"
                  id="probe-query-input"
                  placeholder="e.g. Sync medical telemetry dataset..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  error={validationError || undefined}
                  helperText="Min 2 characters, max 100 characters."
                  disabled={isLoading}
                />

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={isLoading}
                    leftIcon={<Send className="w-4 h-4" />}
                    className="flex-1"
                  >
                    Execute Probe
                  </Button>
                  {(result || error || query) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      disabled={isLoading}
                      aria-label="Reset form"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </form>

              {/* Quick Sample Presets */}
              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Sample Presets
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePreset('AlphaGenome variant correlation index')}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
                  >
                    Standard Query
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreset('trigger-error')}
                    className="text-xs px-2.5 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 transition-colors cursor-pointer"
                  >
                    Trigger Error
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Results / Feedback Inspector */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <CardTitle>Pipeline Response Inspector</CardTitle>
                </div>
                {result && (
                  <Badge variant={isMockResult ? 'mock' : 'success'}>
                    {isMockResult ? 'Resolved via Mock' : 'Resolved via HTTP 200'}
                  </Badge>
                )}
              </div>
              <CardDescription>
                Live preview of normalized response payload and transport metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              {isLoading && <LoadingState message="Simulating network round-trip & metrics extraction..." />}

              {!isLoading && error && (
                <ErrorState
                  title="Pipeline Processing Failed"
                  message={error.message}
                  code={error.code}
                  onRetry={handleRetry}
                />
              )}

              {!isLoading && !error && !result && (
                <EmptyState
                  title="Pipeline Awaiting Execution"
                  description="Submit a probe payload using the form on the left to verify the complete request/response lifecycle."
                  action={
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreset('Initial system verification probe')}
                    >
                      Run Quick Test
                    </Button>
                  }
                />
              )}

              {!isLoading && !error && result && (
                <div className="space-y-4 text-left">
                  {/* Status Headline */}
                  <div className="flex items-start justify-between gap-3 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
                    <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{result.echoMessage}</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-300/80 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      ID: {result.probeId}
                    </span>
                  </div>

                  {/* Metrics Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                        <Hash className="w-3 h-3 text-indigo-400" />
                        <span>Chars</span>
                      </div>
                      <p className="text-base font-bold text-slate-100 font-mono">
                        {result.transformedMetrics.queryLength}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>Words</span>
                      </div>
                      <p className="text-base font-bold text-slate-100 font-mono">
                        {result.transformedMetrics.wordsCount}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                        <Clock className="w-3 h-3 text-sky-400" />
                        <span>Latency</span>
                      </div>
                      <p className="text-base font-bold text-slate-100 font-mono">
                        {result.transformedMetrics.latencyMs}ms
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                        <Cpu className="w-3 h-3 text-emerald-400" />
                        <span>Status</span>
                      </div>
                      <p className="text-base font-bold text-emerald-400 uppercase font-mono">
                        {result.status}
                      </p>
                    </div>
                  </div>

                  {/* Raw Structured JSON Viewer */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span className="font-semibold uppercase tracking-wider text-[11px]">Structured Payload</span>
                      <span className="font-mono text-[10px] text-slate-500">application/json</span>
                    </div>
                    <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-48">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
