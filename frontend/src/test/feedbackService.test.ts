import { describe, it, expect } from 'vitest'
import { feedbackService } from '../services/feedbackService'

describe('FeedbackService', () => {
  it('submits assessment feedback successfully with valid payload', async () => {
    const assessmentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    const result = await feedbackService.submitFeedback({
      assessmentId,
      labelSource: 'expert_verified',
      diseaseObserved: true,
      outcomeStatus: 'improving',
      daysAfterAssessment: 7,
      farmerFoundAdvisoryHelpful: true,
      observedCropType: 'Potato',
      confirmedDisease: 'Late Blight',
      notes: 'Canopy pruning and drip irrigation reduced lesion expansion.',
    })

    expect(result).toBeDefined()
    expect(result.status).toBe('saved')
    expect(result.assessmentId).toBe(assessmentId)
    expect(result.labelSource).toBe('expert_verified')
    expect(result.evaluationEligible).toBe(true)
  }, 10000)

  it('marks non-expert feedback as qualitative rather than formal metrics', async () => {
    const assessmentId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    const result = await feedbackService.submitFeedback({
      assessmentId,
      labelSource: 'farmer_report',
      diseaseObserved: false,
      outcomeStatus: 'recovered',
      daysAfterAssessment: 14,
      farmerFoundAdvisoryHelpful: true,
    })

    expect(result).toBeDefined()
    expect(result.labelSource).toBe('farmer_report')
    expect(result.evaluationEligible).toBe(false)
  }, 10000)
})
