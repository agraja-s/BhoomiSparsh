import React, { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { FarmerDashboard } from '../features/dashboard/FarmerDashboard'
import { NewAssessmentForm } from '../features/assessment/NewAssessmentForm'
import { AssessmentResults } from '../features/assessment/AssessmentResults'
import { assessmentService } from '../services/assessmentService'
import { apiClient } from '../lib/api/client'
import type { Language } from '../utils/translations'
import type {
  AssessmentResponse,
  AssessmentSubmissionPayload,
} from '../types/assessment'
import { Alert } from '../components/ui/Alert'

// Initial seeded demo assessments for Dashboard
const SEEDED_RECENT_ASSESSMENTS: AssessmentResponse[] = [
  {
    assessmentId: 'as-demo-tomato-01',
    generatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    mode: 'mock',
    location: {
      latitude: 18.5204,
      longitude: 73.8567,
      district: 'Pune District',
      state: 'Maharashtra',
      country: 'India',
    },
    diagnosis: {
      cropIdentified: 'Tomato',
      cropGrowthStage: 'Fruiting',
      status: 'candidate_detected',
      primaryCandidate: {
        name: 'Late Blight',
        scientificName: 'Phytophthora infestans',
        confidence: 0.88,
        severity: 'high',
      },
      secondaryCandidates: [],
      imageEvidence: [
        'Water-soaked necrotic leaf spots with irregular margins',
        'Visible chlorotic yellow halo indicating progressive cellular breakdown',
      ],
      imageQuality: { clarity: 'good', warning: null },
      uncertaintyNotes:
        'Symptom clusters align with early fungal sporulation. Weather forecast strongly reinforces transmission risk.',
    },
    weather: {
      provider: 'open-meteo',
      retrievedAt: new Date().toISOString(),
      current: {
        temperatureC: 22.4,
        relativeHumidity: 91,
        precipitationMm: 1.8,
        weatherCondition: 'Overcast with persistent light drizzle',
      },
      hourlyForecast: [
        {
          time: new Date().toISOString(),
          temperatureC: 22.4,
          relativeHumidity: 91,
          precipitationMm: 1.8,
        },
      ],
    },
    riskAssessment: {
      overallRiskLevel: 'high',
      riskIndex: 82,
      modelStatus: 'calculated',
      keyDrivers: [
        'Overnight humidity > 90% creates prolonged free water films on leaf surfaces',
        'Canopy temperatures between 18°C and 22°C are optimal for spore germination',
      ],
      interventionWindow: {
        recommendedActionBy: new Date(Date.now() + 3600000 * 16).toISOString(),
        reason:
          'Prune lower leaves before evening dew formation to minimize leaf wetness duration',
      },
      curve: [
        {
          timestamp: new Date().toISOString(),
          hourLabel: 'Today 06:00',
          riskScore: 68,
          temperatureC: 21.0,
          relativeHumidity: 92,
          category: 'moderate',
        },
        {
          timestamp: new Date(Date.now() + 3600000 * 6).toISOString(),
          hourLabel: 'Today 12:00',
          riskScore: 78,
          temperatureC: 24.5,
          relativeHumidity: 85,
          category: 'high',
        },
        {
          timestamp: new Date(Date.now() + 3600000 * 12).toISOString(),
          hourLabel: 'Today 18:00',
          riskScore: 84,
          temperatureC: 20.8,
          relativeHumidity: 94,
          category: 'high',
        },
        {
          timestamp: new Date(Date.now() + 3600000 * 18).toISOString(),
          hourLabel: 'Tomorrow 00:00',
          riskScore: 82,
          temperatureC: 19.1,
          relativeHumidity: 96,
          category: 'high',
        },
        {
          timestamp: new Date(Date.now() + 3600000 * 24).toISOString(),
          hourLabel: 'Tomorrow 06:00',
          riskScore: 72,
          temperatureC: 20.4,
          relativeHumidity: 88,
          category: 'high',
        },
        {
          timestamp: new Date(Date.now() + 3600000 * 30).toISOString(),
          hourLabel: 'Tomorrow 12:00',
          riskScore: 56,
          temperatureC: 26.2,
          relativeHumidity: 70,
          category: 'moderate',
        },
      ],
    },
    advisory: {
      headline: 'Tomato Late Blight: Elevated Risk Ahead of Prolonged Rain',
      severity: 'high',
      culturalPractices: [
        'Prune lower canopy leaves showing discoloration to increase air circulation.',
        'Cease sprinkler irrigation immediately; rely on drip lines to prevent wetting foliage.',
      ],
      chemicalWarning:
        'DO NOT SPRAY SYNTHETIC CHEMICALS IMMEDIATELY. Inspect foliage closely. Only if lesions spread across >5% of plants should preventative bio-fungicides be considered in consultation with your local agricultural officer.',
      recheckSchedule: 'Inspect field canopy in 24 hours (Tomorrow morning)',
      verifiedSources: [
        'ICAR Indian Institute of Horticultural Research Late Blight Advisory',
        'State Agricultural Extension KVK Pune',
      ],
    },
  },
]

export const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en')
  const [currentView, setCurrentView] = useState<'dashboard' | 'new-assessment' | 'results'>(
    'dashboard'
  )
  const [recentAssessments, setRecentAssessments] = useState<AssessmentResponse[]>(
    SEEDED_RECENT_ASSESSMENTS
  )
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const isMockMode = assessmentService.isMockMode()
  const apiBaseUrl = apiClient.getBaseUrl()

  const handleStartNewAssessment = () => {
    setSubmissionError(null)
    setCurrentView('new-assessment')
  }

  const handleSelectRecentAssessment = (assessment: AssessmentResponse) => {
    setSelectedAssessment(assessment)
    setCurrentView('results')
  }

  const handleSubmitAssessment = async (
    payload: AssessmentSubmissionPayload,
    previewUrl?: string
  ) => {
    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      const result = await assessmentService.submitAssessment(payload, previewUrl)
      setSelectedAssessment(result)
      setRecentAssessments((prev) => [result, ...prev.filter((a) => a.assessmentId !== result.assessmentId)])
      setCurrentView('results')
    } catch (err: unknown) {
      setSubmissionError((err as Error)?.message || 'Failed to analyze crop assessment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout
      isMockMode={isMockMode}
      apiBaseUrl={apiBaseUrl}
      language={language}
      onLanguageChange={setLanguage}
      onNavigateHome={() => setCurrentView('dashboard')}
    >
      {submissionError && (
        <div className="mb-6 max-w-3xl mx-auto">
          <Alert variant="destructive" title="Assessment Failed">
            {submissionError}
          </Alert>
        </div>
      )}

      {currentView === 'dashboard' && (
        <FarmerDashboard
          language={language}
          onStartNewAssessment={handleStartNewAssessment}
          onSelectAssessment={handleSelectRecentAssessment}
          recentAssessments={recentAssessments}
          isMockMode={isMockMode}
        />
      )}

      {currentView === 'new-assessment' && (
        <NewAssessmentForm
          language={language}
          onSubmit={handleSubmitAssessment}
          isLoading={isSubmitting}
          onCancel={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'results' && selectedAssessment && (
        <AssessmentResults
          assessment={selectedAssessment}
          language={language}
          onBack={() => setCurrentView('dashboard')}
          onNewAssessment={handleStartNewAssessment}
        />
      )}
    </Layout>
  )
}

export default App
