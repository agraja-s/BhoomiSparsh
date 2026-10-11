import { ApiError } from '../types/api'
import type { DemoProbeRequest, DemoProbeResponse } from '../types/demo'

export class DemoMockAdapter {
  private simulatedLatencyMs: number

  constructor(simulatedLatencyMs: number = 550) {
    this.simulatedLatencyMs = simulatedLatencyMs
  }

  public async processProbe(request: DemoProbeRequest): Promise<DemoProbeResponse> {
    // Artificial latency to exercise loading spinner & disabled states
    await new Promise((resolve) => setTimeout(resolve, this.simulatedLatencyMs))

    const trimmed = request.inputQuery.trim()

    // Deterministic validation error check
    if (trimmed.toLowerCase() === 'trigger-error') {
      throw new ApiError(
        'Simulated mock failure: "trigger-error" input condition executed.',
        400,
        'MOCK_SIMULATED_ERROR',
        { hint: 'Clear or change the query to test successful mock response.' }
      )
    }

    if (!trimmed) {
      throw new ApiError('Input query cannot be empty.', 400, 'INVALID_INPUT')
    }

    const words = trimmed.split(/\s+/).filter(Boolean)

    return {
      probeId: `mock-prb-${Date.now().toString(36)}`,
      status: 'processed',
      receivedQuery: trimmed,
      transformedMetrics: {
        queryLength: trimmed.length,
        wordsCount: words.length,
        processedAt: new Date().toISOString(),
        latencyMs: this.simulatedLatencyMs,
      },
      echoMessage: `Successfully received and verified payload with ${words.length} word(s). Ready for live API contract binding.`,
    }
  }
}

export const demoMockAdapter = new DemoMockAdapter()
