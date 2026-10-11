import React, { useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { BhoomiLandingPage } from '../features/landing/BhoomiLandingPage'
import { FarmerDashboard } from '../features/dashboard/FarmerDashboard'
import { CheckMyCropView } from '../features/diagnosis/CheckMyCropView'
import { WeatherRiskView } from '../features/weather/WeatherRiskView'
import { AdvisoryCenterView } from '../features/advisories/AdvisoryCenterView'
import { MyFieldsView } from '../features/fields/MyFieldsView'
import { HistoryReportsView } from '../features/history/HistoryReportsView'
import { ProfileSettingsView } from '../features/settings/ProfileSettingsView'
import { EvaluationDashboardView } from '../features/evaluation/EvaluationDashboardView'
import { FarmerAuthModal } from '../features/auth/FarmerAuthModal'
import { assessmentService } from '../services/assessmentService'
import { authService } from '../services/authService'
import { apiClient } from '../lib/api/client'
import type { Language } from '../utils/translations'
import type { AssessmentResponse } from '../types/assessment'
import type { FarmerProfile } from '../types/auth'
import { Alert } from '../components/ui/Alert'

// Initial seeded demo assessments for Dashboard
const SEEDED_RECENT_ASSESSMENTS: AssessmentResponse[] = [
  {
    assessmentId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
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
      cropIdentified: 'Potato',
      cropGrowthStage: 'Tuber Initiation',
      status: 'candidate_detected',
      primaryCandidate: {
        name: 'Late Blight',
        scientificName: 'Phytophthora infestans',
        confidence: 0.88,
        severity: 'high',
      },
      secondaryCandidates: [],
      imageEvidence: [
        'Water-soaked necrotic leaf lesions with irregular borders on lower foliage',
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
          'Inspect lower leaves and prune water-soaked foliage before evening dew formation',
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
      headline: 'Potato Late Blight: Elevated Risk Ahead of 48-Hour Wet Weather',
      severity: 'high',
      culturalPractices: [
        'Prune lower canopy leaves showing discoloration to increase air circulation.',
        'Cease sprinkler irrigation immediately; rely on drip lines to avoid prolonged leaf wetness.',
      ],
      chemicalWarning:
        'DO NOT SPRAY SYNTHETIC CHEMICALS AUTOMATICALLY. Inspect foliage closely. Only if lesions spread across >5% of plants should preventative bio-fungicides be considered in consultation with your local agricultural officer.',
      recheckSchedule: 'Inspect field canopy in 24 hours (Tomorrow morning)',
      verifiedSources: [
        'ICAR Central Potato Research Institute (CPRI) Late Blight Guidelines',
        'State Agricultural Extension KVK Pune District Advisory',
      ],
    },
  },
]

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'scan'
  | 'weather-risk'
  | 'advisories'
  | 'my-fields'
  | 'history'
  | 'settings'
  | 'evaluation'

export const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en')
  const [currentView, setCurrentView] = useState<AppView>('landing')
  const [currentUser, setCurrentUser] = useState<FarmerProfile | null>(() => authService.getCurrentUser())
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login')
  const [pendingDestination, setPendingDestination] = useState<AppView | null>(null)

  const [recentAssessments] = useState<AssessmentResponse[]>(
    SEEDED_RECENT_ASSESSMENTS
  )
  const [_selectedAssessment, setSelectedAssessment] = useState<AssessmentResponse | null>(
    SEEDED_RECENT_ASSESSMENTS[0]
  )
  const [submissionError] = useState<string | null>(null)

  const isMockMode = assessmentService.isMockMode()
  const apiBaseUrl = apiClient.getBaseUrl()

  const handleServiceAccess = (targetView: AppView) => {
    if (currentUser) {
      setCurrentView(targetView)
    } else {
      setPendingDestination(targetView)
      setAuthModalTab('login')
      setIsAuthModalOpen(true)
    }
  }

  const handleStartNewAssessment = () => {
    handleServiceAccess('scan')
  }

  const handleSelectRecentAssessment = (assessment: AssessmentResponse) => {
    setSelectedAssessment(assessment)
    setCurrentView('weather-risk')
  }

  const handleAuthSuccess = (user: FarmerProfile) => {
    setCurrentUser(user)
    setIsAuthModalOpen(false)
    if (pendingDestination) {
      setCurrentView(pendingDestination)
      setPendingDestination(null)
    } else {
      setCurrentView('dashboard')
    }
  }

  const handleLogout = async () => {
    await authService.logout()
    setCurrentUser(null)
    setCurrentView('landing')
  }

  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab)
    setIsAuthModalOpen(true)
  }

  // 1. PUBLIC LANDING PAGE (Screen 1) or Unauthenticated Protection
  if (currentView === 'landing' || !currentUser) {
    return (
      <>
        <BhoomiLandingPage
          language={language}
          onLanguageChange={setLanguage}
          onCheckCrop={() => handleServiceAccess('scan')}
          onViewWeatherRisk={() => handleServiceAccess('weather-risk')}
          onEnterDashboard={() => handleServiceAccess('dashboard')}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
        />
        <FarmerAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
          language={language}
          initialTab={authModalTab}
        />
      </>
    )
  }

  // 2. AUTHENTICATED APPLICATION SHELL WITH SIDEBAR & BOTTOM NAV
  return (
    <>
      <Layout
        isMockMode={isMockMode}
        apiBaseUrl={apiBaseUrl}
        language={language}
        onLanguageChange={setLanguage}
        onNavigateHome={() => setCurrentView('landing')}
        activeNav={currentView}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        onNavigate={(nav) => {
          if (
            nav === 'dashboard' ||
            nav === 'scan' ||
            nav === 'weather-risk' ||
            nav === 'advisories' ||
            nav === 'my-fields' ||
            nav === 'history' ||
            nav === 'settings' ||
            nav === 'evaluation'
          ) {
            setCurrentView(nav as AppView)
          }
        }}
        onStartScan={handleStartNewAssessment}
      >
        {submissionError && (
          <div className="mb-6 max-w-3xl mx-auto">
            <Alert variant="destructive" title="Assessment Failed">
              {submissionError}
            </Alert>
          </div>
        )}

      {/* Screen 2: Farmer Dashboard */}
      {currentView === 'dashboard' && (
        <FarmerDashboard
          language={language}
          onStartNewAssessment={handleStartNewAssessment}
          onSelectAssessment={handleSelectRecentAssessment}
          recentAssessments={recentAssessments}
          isMockMode={isMockMode}
          onNavigateWeatherRisk={() => setCurrentView('weather-risk')}
          onNavigateAdvisories={() => setCurrentView('advisories')}
        />
      )}

      {/* Screen 3: Check My Crop */}
      {currentView === 'scan' && (
        <CheckMyCropView
          language={language}
          onCheckWeatherRisk={() => setCurrentView('weather-risk')}
          onBackToDashboard={() => setCurrentView('dashboard')}
        />
      )}

      {/* Screen 4: Weather & Disease Risk */}
      {currentView === 'weather-risk' && (
        <WeatherRiskView
          language={language}
          onBackToDashboard={() => setCurrentView('dashboard')}
          onViewAdvisories={() => setCurrentView('advisories')}
        />
      )}

      {/* Screen 5: Farmer Advisory Center */}
      {currentView === 'advisories' && (
        <AdvisoryCenterView
          language={language}
          onBackToDashboard={() => setCurrentView('dashboard')}
          onCheckCrop={handleStartNewAssessment}
        />
      )}

      {/* Screen 6: My Fields */}
      {currentView === 'my-fields' && (
        <MyFieldsView
          language={language}
          onStartCropCheck={handleStartNewAssessment}
          onViewWeatherRisk={() => setCurrentView('weather-risk')}
        />
      )}

      {/* Screen 7: History & Reports */}
      {currentView === 'history' && (
        <HistoryReportsView
          language={language}
          onBackToDashboard={() => setCurrentView('dashboard')}
          onCheckCrop={handleStartNewAssessment}
        />
      )}

      {/* Screen 8: Profile & Settings */}
      {currentView === 'settings' && (
        <ProfileSettingsView
          language={language}
          onLanguageChange={setLanguage}
          onBackToDashboard={() => setCurrentView('dashboard')}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {/* Screen 9: AI Evaluation & Controlled Learning Loop (n8n Workflow 2) */}
      {currentView === 'evaluation' && (
        <EvaluationDashboardView
          language={language}
          onBackToDashboard={() => setCurrentView('dashboard')}
          onStartCropCheck={handleStartNewAssessment}
        />
      )}
    </Layout>
    <FarmerAuthModal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      onSuccess={handleAuthSuccess}
      language={language}
    />
  </>
)
}

export default App
