import { describe, it, expect } from 'vitest'
import { AssessmentService } from '../services/assessmentService'
import { AssessmentMockAdapter } from '../mocks/assessmentMock'
import { ApiClient } from '../lib/api/client'
import type { AssessmentSubmissionPayload } from '../types/assessment'

describe('AssessmentService & Mock Adapter', () => {
  it('correctly evaluates crop assessment in mock mode', async () => {
    const service = new AssessmentService(new ApiClient(), new AssessmentMockAdapter(5), true)
    expect(service.isMockMode()).toBe(true)

    // Create a mock File object
    const dummyFile = new File(['mock content'], 'test-leaf.jpg', { type: 'image/jpeg' })
    const payload: AssessmentSubmissionPayload = {
      image: dummyFile,
      cropType: 'Tomato',
      growthStage: 'Fruiting',
      latitude: 18.5204,
      longitude: 73.8567,
      farmerNotes: 'Leaves show dark brown lesions',
    }

    const response = await service.submitAssessment(payload, 'blob:preview-url')
    expect(response.assessmentId).toBeDefined()
    expect(response.mode).toBe('mock')
    expect(response.diagnosis.cropIdentified).toBe('Tomato')
    expect(response.riskAssessment.curve.length).toBeGreaterThan(0)
    expect(response.advisory.headline).toContain('Late Blight')
    expect(response.imageUrl).toBe('blob:preview-url')
  })

  it('generates lower risk curve for cotton crop', async () => {
    const mock = new AssessmentMockAdapter(5)
    const dummyFile = new File(['mock content'], 'cotton.jpg', { type: 'image/jpeg' })
    const payload: AssessmentSubmissionPayload = {
      image: dummyFile,
      cropType: 'Cotton',
      growthStage: 'Vegetative',
      latitude: 20.0,
      longitude: 75.0,
    }

    const response = await mock.evaluateCrop(payload)
    expect(response.riskAssessment.overallRiskLevel).toBe('low')
  })
})
