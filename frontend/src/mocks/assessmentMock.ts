import type {
  AssessmentResponse,
  AssessmentSubmissionPayload,
  RiskCurvePoint,
} from '../types/assessment'

export class AssessmentMockAdapter {
  private simulatedLatencyMs: number

  constructor(simulatedLatencyMs: number = 700) {
    this.simulatedLatencyMs = simulatedLatencyMs
  }

  public async evaluateCrop(
    payload: AssessmentSubmissionPayload,
    previewUrl?: string
  ): Promise<AssessmentResponse> {
    await new Promise((resolve) => setTimeout(resolve, this.simulatedLatencyMs))

    const crop = payload.cropType
    const stage = payload.growthStage
    const lat = payload.latitude || 18.5204
    const lng = payload.longitude || 73.8567

    // Generate realistic timestamps
    const now = new Date()
    const nowIso = now.toISOString()

    // 48-Hour curve intervals
    const curvePoints: RiskCurvePoint[] = []
    const hoursAhead = [0, 6, 12, 18, 24, 30, 36, 42, 48]

    let baseRisk = 75
    let primaryDisease = 'Late Blight'
    let scientificName = 'Phytophthora infestans'
    let severity: 'high' | 'moderate' | 'low' = 'high'
    let status: 'candidate_detected' | 'healthy' | 'inconclusive' = 'candidate_detected'

    if (crop === 'Cotton') {
      baseRisk = 28
      primaryDisease = 'Bacterial Blight (Early / Low)'
      scientificName = 'Xanthomonas citri pv. malvacearum'
      severity = 'low'
    } else if (crop === 'Wheat' || crop === 'Rice') {
      baseRisk = 48
      primaryDisease = 'Brown Rust / Blast Susceptibility'
      scientificName = 'Puccinia triticina'
      severity = 'moderate'
    }

    hoursAhead.forEach((hr) => {
      const pointDate = new Date(now.getTime() + hr * 3600 * 1000)
      const hourStr = pointDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      const dayLabel = hr < 24 ? 'Today' : 'Tomorrow'

      // Micro-climate simulation: humidity peaks at night/dawn, temp peaks at midday
      const isNight = hr % 24 >= 18 || hr % 24 < 6
      const temp = isNight ? 19.5 + (hr % 3) : 26.2 - (hr % 4)
      const humidity = isNight ? 92 - (hr % 5) : 72 + (hr % 6)

      // Risk score models moisture & temperature combination
      let score = baseRisk
      if (humidity > 85 && temp >= 18 && temp <= 24) {
        score = Math.min(94, score + 12)
      } else if (humidity < 75) {
        score = Math.max(20, score - 15)
      }

      curvePoints.push({
        timestamp: pointDate.toISOString(),
        hourLabel: `${dayLabel} ${hourStr}`,
        riskScore: Math.round(score),
        temperatureC: Math.round(temp * 10) / 10,
        relativeHumidity: Math.round(humidity),
        category: score >= 70 ? 'high' : score >= 40 ? 'moderate' : 'low',
      })
    })

    const overallLevel = baseRisk >= 70 ? 'high' : baseRisk >= 40 ? 'moderate' : 'low'

    return {
      assessmentId: `as-mock-${Date.now().toString(36).toUpperCase()}`,
      generatedAt: nowIso,
      mode: 'mock',
      imageUrl: previewUrl,
      location: {
        latitude: lat,
        longitude: lng,
        district: 'Pune District',
        state: 'Maharashtra',
        country: 'India',
      },
      diagnosis: {
        cropIdentified: crop,
        cropGrowthStage: stage,
        status: status,
        primaryCandidate: {
          name: primaryDisease,
          scientificName: scientificName,
          confidence: baseRisk >= 70 ? 0.86 : 0.62,
          severity: severity,
        },
        secondaryCandidates: [
          {
            name: 'Nutritional Zinc Deficiency / Leaf Scorch',
            confidence: 0.28,
            severity: 'low',
          },
        ],
        imageEvidence: [
          'Irregular brownish-black necrotic lesions observed near leaflet margins',
          'Chlorotic yellow halos surrounding active lesion borders',
          'Early canopy moisture retention detected on lower foliage',
        ],
        imageQuality: {
          clarity: 'good',
          warning: null,
        },
        uncertaintyNotes:
          'Field symptoms share visual similarities with early-stage bacterial leaf spot. Micro-climatic sensor fusion strongly elevates fungal spore risk.',
      },
      weather: {
        provider: 'open-meteo',
        retrievedAt: nowIso,
        current: {
          temperatureC: 23.8,
          relativeHumidity: 87,
          precipitationMm: 0.6,
          weatherCondition: 'Overcast, high atmospheric humidity',
        },
        hourlyForecast: curvePoints.map((p) => ({
          time: p.timestamp,
          temperatureC: p.temperatureC,
          relativeHumidity: p.relativeHumidity,
          precipitationProbability: p.relativeHumidity > 85 ? 65 : 20,
          precipitationMm: p.relativeHumidity > 90 ? 1.4 : 0.0,
        })),
      },
      riskAssessment: {
        overallRiskLevel: overallLevel,
        riskIndex: baseRisk,
        modelStatus: 'calculated',
        keyDrivers: [
          'Forecasted sustained relative humidity > 85% for 18 consecutive hours',
          'Favorable fungal sporulation temperature range (18°C – 23°C)',
          'Dew duration index exceeds 6 hours during morning canopy cooling',
        ],
        interventionWindow: {
          recommendedActionBy: new Date(now.getTime() + 18 * 3600 * 1000).toISOString(),
          reason: 'Execute canopy thinning before overnight dew formation initiates fungal spore germination',
        },
        curve: curvePoints,
      },
      advisory: {
        headline: `${crop} ${primaryDisease}: Elevated Early Micro-Climate Vulnerability`,
        severity: severity,
        culturalPractices: [
          'Prune severely diseased lower leaves and bury or compost them away from the field to reduce inoculum spread.',
          'Suspend overhead sprinkler watering; irrigate through ground drip lines early in the morning to keep foliage dry.',
          'Improve inter-row ventilation by removing excessive weed canopy around the root zone.',
        ],
        chemicalWarning:
          'DO NOT SPRAY SYNTHETIC CHEMICAL FUNGICIDES PREMATURELY. Synthetic chemical treatment should only be evaluated if lesion counts exceed 5% of the total canopy upon physical verification. Prefer biological Trichoderma or copper-based preventative sprays if approved by local agricultural extension.',
        recheckSchedule: 'Inspect field canopy in 24 hours (Tomorrow before 09:00 AM)',
        verifiedSources: [
          'ICAR National Research Centre for Integrated Pest Management',
          'State Agricultural Extension Advisory (KVK Maharashtra)',
          'FAO Plant Protection Bulletin',
        ],
      },
    }
  }
}

export const assessmentMockAdapter = new AssessmentMockAdapter()
