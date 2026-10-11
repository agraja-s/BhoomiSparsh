export interface DemoProbeRequest {
  inputQuery: string
  timestamp: string
}

export interface DemoProbeMetrics {
  queryLength: number
  wordsCount: number
  processedAt: string
  latencyMs: number
}

export interface DemoProbeResponse {
  probeId: string
  status: 'processed' | 'pending' | 'failed'
  receivedQuery: string
  transformedMetrics: DemoProbeMetrics
  echoMessage: string
}
