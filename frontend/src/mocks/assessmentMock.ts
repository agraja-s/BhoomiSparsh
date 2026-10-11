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

    const crop = payload.cropType || 'Tomato'
    const stage = payload.growthStage || 'Vegetative'
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

    const uuid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0
            const v = c === 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
          })

    return {
      assessmentId: uuid,
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
      farmerReport: {
        cropIdentified: {
          en: crop,
          hi: crop === 'Potato' ? 'आलू' : crop === 'Tomato' ? 'टमाटर' : crop === 'Rice' ? 'चावल' : 'कपास',
          mr: crop === 'Potato' ? 'बटाटा' : crop === 'Tomato' ? 'टोमॅटो' : crop === 'Rice' ? 'भात' : 'कापूस',
        },
        growthStage: {
          en: stage,
          hi: 'वानस्पतिक अवस्था',
          mr: 'शाकीय वाढीची अवस्था',
        },
        imageQuality: {
          clarity: 'good',
          warningEn: null,
          warningHi: null,
          warningMr: null,
        },
        status: status,
        diagnosis: {
          diseaseName: {
            en: primaryDisease,
            hi: 'पछेती झुलसा रोग (लेट ब्लाइट)',
            mr: 'उशिरा करपा रोग (लेट ब्लाइट)',
          },
          scientificName,
          confidence: baseRisk >= 70 ? 0.86 : 0.62,
          severity,
          whatFarmerSees: {
            en: 'Dark water-soaked spots on leaves with pale borders, visible leaf wilt',
            hi: 'पत्तियों पर गहरे पानीदार धब्बे और हल्की पीली किनारी, पत्तियां मुरझा रही हैं',
            mr: 'पानांवर गडद पाण्याचे डाग आणि फिकट पिवळी कडा, पाने सुकताना दिसत आहेत',
          },
          isItSerious: {
            en: 'Yes — high humidity accelerates spore spread across the field within 24-48 hours',
            hi: 'हाँ — उच्च आर्द्रता 24-48 घंटों के भीतर पूरे खेत में बीजाणुओं को फैला सकती है',
            mr: 'होय — जास्त आर्द्रतेमुळे २४ ते ४८ तासांत संपूर्ण शेतात रोगाचा प्रादुर्भाव वाढू शकतो',
          },
        },
        immediateActions: [
          {
            step: 1,
            en: 'Remove and bag discolored leaves immediately — do not leave in field',
            hi: 'रोगग्रस्त पत्तियों को तुरंत तोड़कर खेत से बाहर नष्ट करें',
            mr: 'बाधित पाने लगेच तोडून शेताबाहेर नष्ट करा',
          },
          {
            step: 2,
            en: 'Cease overhead sprinkler watering; supply water directly to root base via drip',
            hi: 'ऊपर से छिड़काव बंद करें, केवल ड्रिप या जड़ों में पानी दें',
            mr: 'वरून पाणी देणे बंद करा; फक्त ठिबक किंवा मुळाशी पाणी द्या',
          },
          {
            step: 3,
            en: 'Inspect nearby plants within a 5-meter radius for early speckling',
            hi: '5 मीटर के दायरे में अन्य पौधों की भी बारीकी से जांच करें',
            mr: '५ मीटरच्या परिघात इतर झाडांचीही बारकाईने तपासणी करा',
          },
        ],
        urgency: {
          level: severity === 'high' ? 'high' : 'medium',
          actByEn: 'Act within 24 hours before evening dew',
          actByHi: 'शाम की ओस से पहले 24 घंटे के भीतर कार्रवाई करें',
          actByMr: 'संध्याकाळच्या दव पडण्यापूर्वी २४ तासांत उपाय करा',
        },
        recheckIn: {
          en: 'Inspect again tomorrow morning before 9:00 AM',
          hi: 'कल सुबह 9:00 बजे से पहले दोबारा निरीक्षण करें',
          mr: 'उद्या सकाळी ९:०० वाजेपूर्वी पुन्हा तपासणी करा',
        },
        callExpert: severity === 'high',
        expertReasonEn: 'High humidity combined with optimal temperature accelerates lesion expansion',
        expertReasonHi: 'अनुकूल तापमान और नमी से बीमारी तेजी से बढ़ सकती है',
        expertReasonMr: 'अनुकूल तापमान व आर्द्रतेमुळे रोगाचा प्रादुर्भाव वेगाने वाढू शकतो',
        uncertaintyNote: {
          en: 'AI assessment based on visual indicators. Always verify with physical ground inspection.',
          hi: 'यह दृश्य संकेतों पर आधारित AI मूल्यांकन है। खेत में प्रत्यक्ष जांच अवश्य करें।',
          mr: 'हे दृश्य लक्षणांवर आधारित AI विश्लेषण आहे. प्रत्यक्ष शेतात जाऊन खात्री करा.',
        },
      },
      rawAiResponse: {
        cropIdentified: crop,
        growthStage: stage,
        diagnosis: {
          diseaseName: primaryDisease,
          scientificName,
          confidence: 0.88,
          severity,
          whatFarmerSees: 'Water-soaked irregular lesions on leaf edges with pale halos.',
        },
        riskAssessment: {
          overallRiskLevel: severity,
          riskIndex: baseRisk,
        },
        mode: 'mock',
      },
      aiAgentText: `Crop Health Diagnosis:\n• Crop: ${crop} (${stage})\n• Detected Condition: ${primaryDisease} (${scientificName})\n• Risk Assessment: ${severity.toUpperCase()} severity under current micro-climate humidity levels.\n• Recommended Actions:\n1. Remove and bag discolored leaves immediately — do not leave in field.\n2. Cease overhead sprinkler watering; supply water directly to root base via drip.\n3. Inspect nearby plants within a 5-meter radius for early speckling.`,
    }
  }
}

export const assessmentMockAdapter = new AssessmentMockAdapter()
