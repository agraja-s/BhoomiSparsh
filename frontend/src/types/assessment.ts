export type CropType =
  | 'Tomato'
  | 'Potato'
  | 'Rice'
  | 'Wheat'
  | 'Cotton'
  | 'Soybean'
  | 'Onion'
  | 'Chilli'

export type GrowthStage =
  | 'Seedling'
  | 'Vegetative'
  | 'Flowering'
  | 'Fruiting'
  | 'Mature'

export type RiskLevel = 'low' | 'moderate' | 'high' | 'inconclusive'

export interface LocationInfo {
  latitude: number
  longitude: number
  district?: string
  state?: string
  country?: string
}

export interface DiagnosisCandidate {
  name: string
  scientificName?: string
  confidence?: number | null
  severity?: 'low' | 'moderate' | 'high' | 'critical'
}

export interface ImageQualityInfo {
  clarity: 'good' | 'fair' | 'poor'
  warning?: string | null
}

export interface DiagnosisInfo {
  cropIdentified: string
  cropGrowthStage: string
  status: 'candidate_detected' | 'healthy' | 'inconclusive'
  primaryCandidate?: DiagnosisCandidate | null
  secondaryCandidates?: DiagnosisCandidate[]
  imageEvidence: string[]
  imageQuality: ImageQualityInfo
  uncertaintyNotes?: string | null
}

export interface CurrentWeather {
  temperatureC: number
  relativeHumidity: number
  precipitationMm?: number
  weatherCondition?: string
}

export interface HourlyWeather {
  time: string
  temperatureC: number
  relativeHumidity: number
  precipitationProbability?: number
  precipitationMm?: number
}

export interface WeatherInfo {
  provider: string
  retrievedAt: string
  current: CurrentWeather
  hourlyForecast: HourlyWeather[]
}

export interface RiskCurvePoint {
  timestamp: string
  hourLabel: string
  riskScore: number // 0 - 100
  temperatureC: number
  relativeHumidity: number
  category: 'low' | 'moderate' | 'high'
}

export interface InterventionWindow {
  recommendedActionBy?: string | null
  reason?: string | null
}

export interface RiskAssessmentInfo {
  overallRiskLevel: 'low' | 'moderate' | 'high' | 'inconclusive'
  riskIndex: number // 0 - 100
  modelStatus: 'calculated' | 'insufficient_data' | 'unavailable'
  keyDrivers: string[]
  interventionWindow?: InterventionWindow | null
  curve: RiskCurvePoint[]
}

export interface AdvisoryInfo {
  headline: string
  severity: 'low' | 'moderate' | 'high' | 'critical'
  culturalPractices: string[]
  chemicalWarning: string
  recheckSchedule?: string | null
  verifiedSources?: string[]
}

export interface MultilingualText {
  en: string
  hi: string
  mr: string
}

export interface ImmediateActionStep {
  step: number
  en: string
  hi: string
  mr: string
}

export interface UrgencyInfo {
  level: 'low' | 'medium' | 'high' | 'critical'
  actByEn: string
  actByHi: string
  actByMr: string
}

export interface FarmerFriendlyDiagnosis {
  cropIdentified?: MultilingualText | string
  growthStage?: MultilingualText | string
  imageQuality?: {
    clarity: 'good' | 'fair' | 'poor'
    warningEn?: string | null
    warningHi?: string | null
    warningMr?: string | null
  }
  status: 'candidate_detected' | 'healthy' | 'inconclusive'
  diagnosis?: {
    diseaseName?: MultilingualText | string
    scientificName?: string
    confidence?: number
    severity?: 'low' | 'moderate' | 'high' | 'critical'
    whatFarmerSees?: MultilingualText | string
    isItSerious?: MultilingualText | string
  }
  immediateActions?: ImmediateActionStep[]
  urgency?: UrgencyInfo
  recheckIn?: MultilingualText | string
  callExpert?: boolean
  expertReasonEn?: string
  expertReasonHi?: string
  expertReasonMr?: string
  uncertaintyNote?: MultilingualText | string
}

export interface AssessmentResponse {
  assessmentId: string
  generatedAt: string
  mode: 'mock' | 'live'
  location: LocationInfo
  diagnosis: DiagnosisInfo
  weather: WeatherInfo
  riskAssessment: RiskAssessmentInfo
  advisory: AdvisoryInfo
  imageUrl?: string // local object URL or returned CDN URL for preview
  farmerReport?: FarmerFriendlyDiagnosis
}

export interface AssessmentSubmissionPayload {
  image: File
  cropType?: CropType
  growthStage?: GrowthStage
  latitude: number
  longitude: number
  farmerNotes?: string
}

export type FeedbackLabelSource = 'farmer_report' | 'expert_verified' | 'field_observed'

export type FeedbackOutcomeStatus =
  | 'recovered'
  | 'improving'
  | 'no_change'
  | 'worsening'
  | 'spread_to_other_plants'
  | 'crop_loss'
  | 'unknown'

export interface AssessmentFeedbackSubmission {
  assessmentId: string
  labelSource: FeedbackLabelSource
  diseaseObserved: boolean | 'unknown'
  outcomeStatus: FeedbackOutcomeStatus
  daysAfterAssessment?: number
  farmerFoundAdvisoryHelpful?: boolean
  observedCropType?: string
  confirmedDisease?: string
  notes?: string
}

export interface AssessmentFeedbackResponse {
  feedbackId: string
  assessmentId: string
  status: 'saved' | 'duplicate'
  labelSource?: string
  verificationStatus?: string
  evaluationEligible?: boolean
  evaluationBlockers?: string[]
  message?: string
}

export interface EvaluationRunSummary {
  runKey: string
  evaluatedAt: string
  datasetSize: number
  expertVerifiedSize: number
  evaluationStatus: 'completed' | 'inconclusive' | 'insufficient_data'
  diagnosticAccuracy?: number | null
  alertPrecision?: number | null
  alertRecall?: number | null
  qualityCheckPassRate?: number | null
  topWeaknesses?: Array<{ subject: string; note: string; count: number }>
  proposedRulesCount?: number
}

