import { apiClient, type ApiClient } from '../lib/api/client'
import { assessmentMockAdapter, type AssessmentMockAdapter } from '../mocks/assessmentMock'
import type { AssessmentResponse, AssessmentSubmissionPayload } from '../types/assessment'

export interface IAssessmentService {
  isMockMode(): boolean
  submitAssessment(
    payload: AssessmentSubmissionPayload,
    previewUrl?: string
  ): Promise<AssessmentResponse>
}

export class AssessmentService implements IAssessmentService {
  private client: ApiClient
  private mock: AssessmentMockAdapter
  private useMocks: boolean

  constructor(
    client: ApiClient = apiClient,
    mock: AssessmentMockAdapter = assessmentMockAdapter,
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

  public async submitAssessment(
    payload: AssessmentSubmissionPayload,
    previewUrl?: string
  ): Promise<AssessmentResponse> {
    if (this.useMocks) {
      return this.mock.evaluateCrop(payload, previewUrl)
    }

    const formData = new FormData()
    formData.append('image', payload.image)
    formData.append('cropType', payload.cropType)
    formData.append('growthStage', payload.growthStage)
    formData.append('latitude', String(payload.latitude))
    formData.append('longitude', String(payload.longitude))
    if (payload.farmerNotes) {
      formData.append('farmerNotes', payload.farmerNotes)
    }

    const response = await this.client.post<AssessmentResponse>('/api/v1/assessments', formData)
    return {
      ...response,
      imageUrl: previewUrl,
    }
  }
}

export const assessmentService = new AssessmentService()
