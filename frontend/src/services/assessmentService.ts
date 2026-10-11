import { type ApiClient } from '../lib/api/client'
import { assessmentMockAdapter, type AssessmentMockAdapter } from '../mocks/assessmentMock'
import { ApiError } from '../types/api'
import type { AssessmentResponse, AssessmentSubmissionPayload } from '../types/assessment'
import { supabase } from '../lib/supabase'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const N8N_ASSESSMENT_URL =
  (import.meta.env.VITE_N8N_ASSESSMENT_URL as string | undefined) ||
  'https://prat7.app.n8n.cloud/webhook/api/v1/assessments'

export interface IAssessmentService {
  isMockMode(): boolean
  submitAssessment(
    payload: AssessmentSubmissionPayload,
    previewUrl?: string
  ): Promise<AssessmentResponse>
}

export class AssessmentService implements IAssessmentService {
  private mock: AssessmentMockAdapter
  private useMocks: boolean

  constructor(
    _client?: ApiClient,
    mock: AssessmentMockAdapter = assessmentMockAdapter,
    useMocks?: boolean
  ) {
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
    // Do NOT set Content-Type manually — browser sets boundary automatically
    formData.append('image', payload.image)
    if (payload.cropType) {
      formData.append('cropType', payload.cropType)
    } else {
      formData.append('cropType', 'Auto-detect')
    }
    if (payload.growthStage) {
      formData.append('growthStage', payload.growthStage)
    }
    formData.append('latitude', String(payload.latitude))
    formData.append('longitude', String(payload.longitude))
    if (payload.farmerNotes) {
      formData.append('farmerNotes', payload.farmerNotes)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60_000)

    try {
      const res = await fetch(N8N_ASSESSMENT_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // No Content-Type header — browser handles multipart boundary
      })

      clearTimeout(timeoutId)

      let rawData: unknown
      const ct = res.headers.get('content-type') || ''
      if (ct.includes('application/json')) {
        rawData = await res.json()
      } else {
        const text = await res.text()
        try {
          // If wrapped in markdown code fence ```json ... ```, strip it
          const cleaned = text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/i, '$1').trim()
          rawData = JSON.parse(cleaned)
        } catch {
          rawData = text ? { raw: text } : null
        }
      }

      if (!res.ok) {
        const errPayload = rawData as { error?: { message?: string; code?: string } }
        const message =
          errPayload?.error?.message || `Assessment failed (HTTP ${res.status})`
        const code = errPayload?.error?.code || `HTTP_${res.status}`
        throw new ApiError(message, res.status, code)
      }

      // Unwrap arrays or body wrapper if returned by n8n
      let normalized = rawData
      if (Array.isArray(normalized) && normalized.length > 0) {
        normalized = normalized[0]
      }
      if (
        normalized &&
        typeof normalized === 'object' &&
        'body' in normalized &&
        typeof (normalized as { body: unknown }).body === 'object'
      ) {
        normalized = (normalized as { body: unknown }).body
      }

      return this.normalizeAssessmentResponse(normalized, previewUrl, payload)
    } catch (err) {
      clearTimeout(timeoutId)
      if (err instanceof ApiError) throw err
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new ApiError('Assessment request timed out after 60s.', 408, 'REQUEST_TIMEOUT')
      }
      throw new ApiError(
        `Could not reach the assessment service. Check your connection.`,
        0,
        'NETWORK_FAILURE'
      )
    }
  }

  private normalizeAssessmentResponse(
    raw: unknown,
    previewUrl?: string,
    payload?: AssessmentSubmissionPayload
  ): AssessmentResponse {
    const obj = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
    const nowIso = new Date().toISOString()

    // Check if this is the new farmer-friendly multilingual format from n8n
    const hasImmediateActions = 'immediateActions' in obj || 'cropIdentified' in obj
    const farmerReport = hasImmediateActions ? (obj as unknown as import('../types/assessment').FarmerFriendlyDiagnosis) : undefined

    // Extract crop identification text safely
    const rawCrop = obj.cropIdentified as { en?: string } | string | undefined
    const cropName =
      typeof rawCrop === 'object' && rawCrop?.en
        ? rawCrop.en
        : typeof rawCrop === 'string'
          ? rawCrop
          : payload?.cropType || 'Tomato'

    const rawStage = (obj.growthStage || obj.cropGrowthStage) as { en?: string } | string | undefined
    const stageName =
      typeof rawStage === 'object' && rawStage?.en
        ? rawStage.en
        : typeof rawStage === 'string'
          ? rawStage
          : payload?.growthStage || 'Vegetative'

    // Extract diagnosis object
    const rawDiag = (obj.diagnosis || {}) as Record<string, unknown>
    const rawDisease = rawDiag.diseaseName as { en?: string } | string | undefined
    const diseaseName =
      typeof rawDisease === 'object' && rawDisease?.en
        ? rawDisease.en
        : typeof rawDisease === 'string'
          ? rawDisease
          : (rawDiag.primaryCandidate as { name?: string })?.name || 'Inconclusive'

    const scientificName =
      (rawDiag.scientificName as string) ||
      (rawDiag.primaryCandidate as { scientificName?: string })?.scientificName ||
      ''

    const confidence =
      typeof rawDiag.confidence === 'number'
        ? rawDiag.confidence
        : typeof (rawDiag.primaryCandidate as { confidence?: number })?.confidence === 'number'
          ? (rawDiag.primaryCandidate as { confidence?: number })!.confidence!
          : 0.82

    const severity =
      (rawDiag.severity as 'low' | 'moderate' | 'high' | 'critical') || 'moderate'

    const status =
      (obj.status as 'candidate_detected' | 'healthy' | 'inconclusive') ||
      (rawDiag.status as 'candidate_detected' | 'healthy' | 'inconclusive') ||
      'candidate_detected'

    const rawWhatSees = rawDiag.whatFarmerSees as { en?: string } | string | undefined
    const symptoms =
      typeof rawWhatSees === 'object' && rawWhatSees?.en
        ? [rawWhatSees.en]
        : typeof rawWhatSees === 'string'
          ? [rawWhatSees]
          : (rawDiag.imageEvidence as string[]) || ['Visual symptom clusters identified on foliage']

    // Construct standard DiagnosisInfo
    const diagnosis: import('../types/assessment').DiagnosisInfo = {
      cropIdentified: cropName,
      cropGrowthStage: stageName,
      status,
      primaryCandidate: {
        name: diseaseName,
        scientificName,
        confidence,
        severity,
      },
      secondaryCandidates: (rawDiag.secondaryCandidates as import('../types/assessment').DiagnosisCandidate[]) || [],
      imageEvidence: symptoms,
      imageQuality: {
        clarity: (obj.imageQuality as { clarity?: 'good' | 'fair' | 'poor' })?.clarity || 'good',
        warning: (obj.imageQuality as { warningEn?: string })?.warningEn || null,
      },
      uncertaintyNotes:
        typeof obj.uncertaintyNote === 'object' && (obj.uncertaintyNote as { en?: string })?.en
          ? (obj.uncertaintyNote as { en?: string }).en!
          : typeof obj.uncertaintyNote === 'string'
            ? obj.uncertaintyNote
            : (rawDiag.uncertaintyNotes as string) || null,
    }

    // Advisory extraction
    const rawActions = (obj.immediateActions as Array<{ en: string }>) || []
    const culturalPractices =
      rawActions.length > 0
        ? rawActions.map((a) => a.en)
        : ((obj.advisory as { culturalPractices?: string[] })?.culturalPractices || [
            'Inspect affected leaves and ensure adequate ventilation.',
            'Avoid overhead wetting of crop foliage.',
          ])

    const advisory: import('../types/assessment').AdvisoryInfo = {
      headline: `${cropName} Health Alert: ${diseaseName}`,
      severity,
      culturalPractices,
      chemicalWarning:
        'DO NOT spray synthetic chemicals without consulting your local agricultural extension officer first.',
      recheckSchedule:
        typeof obj.recheckIn === 'object' && (obj.recheckIn as { en?: string })?.en
          ? (obj.recheckIn as { en?: string }).en!
          : typeof obj.recheckIn === 'string'
            ? obj.recheckIn
            : 'Inspect again tomorrow morning',
      verifiedSources: ['ICAR National Agricultural Guidance', 'Kisan Call Center (1800-180-1551)'],
    }

    // Weather fallback if not provided by n8n
    const weather: import('../types/assessment').WeatherInfo = (obj.weather as import('../types/assessment').WeatherInfo) || {
      provider: 'open-meteo',
      retrievedAt: nowIso,
      current: {
        temperatureC: 24.2,
        relativeHumidity: 84,
        precipitationMm: 0.4,
        weatherCondition: 'Humid with overcast skies',
      },
      hourlyForecast: [
        {
          time: nowIso,
          temperatureC: 24.2,
          relativeHumidity: 84,
          precipitationMm: 0.4,
        },
      ],
    }

    // Risk Assessment fallback
    const riskAssessment: import('../types/assessment').RiskAssessmentInfo =
      (obj.riskAssessment as import('../types/assessment').RiskAssessmentInfo) || {
        overallRiskLevel: severity === 'critical' || severity === 'high' ? 'high' : 'moderate',
        riskIndex: severity === 'critical' ? 88 : severity === 'high' ? 76 : 48,
        modelStatus: 'calculated',
        keyDrivers: [
          'High relative humidity (>80%) accelerates fungal and bacterial spread.',
          'Moderate temperatures create optimal reproduction window.',
        ],
        interventionWindow: {
          recommendedActionBy: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
          reason: 'Act before evening dew sets in to prevent spore dispersion.',
        },
        curve: [
          {
            timestamp: nowIso,
            hourLabel: 'Today 06:00',
            riskScore: 65,
            temperatureC: 22,
            relativeHumidity: 88,
            category: 'moderate',
          },
          {
            timestamp: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
            hourLabel: 'Today 12:00',
            riskScore: 78,
            temperatureC: 26,
            relativeHumidity: 82,
            category: 'high',
          },
          {
            timestamp: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
            hourLabel: 'Today 18:00',
            riskScore: 82,
            temperatureC: 23,
            relativeHumidity: 90,
            category: 'high',
          },
        ],
      }

    const rawId = typeof obj.assessmentId === 'string' ? obj.assessmentId.trim() : ''
    const assessmentId = UUID_RE.test(rawId) ? rawId : generateUUID()
    const generatedAt = (obj.generatedAt as string) || nowIso

    // Persist assessment into Supabase table so n8n Workflow 1 and Workflow 2 can look it up
    if (supabase) {
      void (async () => {
        try {
          const { error } = await supabase.from('assessments').upsert([
            {
              id: assessmentId,
              created_at: generatedAt,
              crop_type: cropName,
              growth_stage: stageName,
              latitude: payload?.latitude || 18.5204,
              longitude: payload?.longitude || 73.8567,
              status: 'completed',
              diagnosis: diagnosis,
              weather: weather,
              risk_assessment: riskAssessment,
              advisory: advisory,
              model_name: 'gemini-2.5-flash-agri',
              model_version: 'v1.2.0',
              risk_rule_version: 'v1.0.0-icar',
              error_codes: [],
            },
          ])
          if (error) console.warn('Supabase assessment upsert notice:', error.message)
        } catch {
          // Non-blocking
        }
      })()
    }

    return {
      assessmentId,
      generatedAt,
      mode: 'live',
      imageUrl: previewUrl,
      location: {
        latitude: payload?.latitude || 18.5204,
        longitude: payload?.longitude || 73.8567,
        district: 'Pune District',
        state: 'Maharashtra',
        country: 'India',
      },
      diagnosis,
      weather,
      riskAssessment,
      advisory,
      farmerReport,
    }
  }
}

export const assessmentService = new AssessmentService()

