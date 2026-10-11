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
}

export interface AssessmentSubmissionPayload {
  image: File
  cropType: CropType
  growthStage: GrowthStage
  latitude: number
  longitude: number
  farmerNotes?: string
}
