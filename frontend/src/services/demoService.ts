import { apiClient, type ApiClient } from '../lib/api/client'
import { demoMockAdapter, type DemoMockAdapter } from '../mocks/demoMock'
import type { DemoProbeRequest, DemoProbeResponse } from '../types/demo'

export interface IDemoService {
  isMockMode(): boolean
  sendProbe(query: string): Promise<{ data: DemoProbeResponse; isMock: boolean }>
}

export class DemoService implements IDemoService {
  private client: ApiClient
  private mock: DemoMockAdapter
  private useMocks: boolean

  constructor(
    client: ApiClient = apiClient,
    mock: DemoMockAdapter = demoMockAdapter,
    useMocks?: boolean
  ) {
    this.client = client
    this.mock = mock
    const envVal = import.meta.env.VITE_USE_MOCKS as string | undefined
    this.useMocks = useMocks ?? (envVal === 'true' || envVal === undefined)
  }

  public isMockMode(): boolean {
    return this.useMocks
  }

  public async sendProbe(query: string): Promise<{ data: DemoProbeResponse; isMock: boolean }> {
    const payload: DemoProbeRequest = {
      inputQuery: query,
      timestamp: new Date().toISOString(),
    }

    if (this.useMocks) {
      const data = await this.mock.processProbe(payload)
      return { data, isMock: true }
    }

    const data = await this.client.post<DemoProbeResponse>('/api/demo/probe', payload)
    return { data, isMock: false }
  }
}

export const demoService = new DemoService()
