# AGRISENTRY API CONTRACT SPECIFICATION

> **Service**: `agrisentry-api`  
> **API Version**: `1.0.0`  
> **Frontend Lead**: Developer 1  
> **Backend Lead**: Developer 2 (Separate Environment)  
> **Base URL**: Configured via `VITE_API_BASE_URL` (default: `http://localhost:5000`)

---

## 1. Health Check Endpoint

### `GET /api/v1/health`
Checks availability of the backend server and its third-party upstream integrations (Gemini, Open-Meteo).

#### Response (200 OK)
```json
{
  "status": "ok",
  "service": "agrisentry-api",
  "version": "1.0.0",
  "mode": "live",
  "integrations": {
    "geminiConfigured": true,
    "weatherProvider": "open-meteo"
  }
}
```

---

## 2. Crop Health Assessment Endpoint

### `POST /api/v1/assessments`
Uploads crop field imagery, field coordinates, and crop growth metadata to generate a combined diagnosis, micro-climatic forecast, time-based disease risk curve, and actionable advisory.

#### Request Headers
- `Accept: application/json`
- `Content-Type: multipart/form-data` *(Note: Let browser/HTTP client generate the boundary automatically)*

#### Request Form Data (Fields)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `image` | Binary File | **Yes** | Crop photo (JPEG, PNG, WebP $\le$ 10MB) |
| `cropType` | String | **Yes** | e.g., `Tomato`, `Potato`, `Rice`, `Wheat`, `Cotton`, `Soybean`, `Onion`, `Chilli` |
| `growthStage` | String | **Yes** | e.g., `Seedling`, `Vegetative`, `Flowering`, `Fruiting`, `Mature` |
| `latitude` | Number | **Yes** | Field latitude coordinate (e.g., `18.5204`) |
| `longitude` | Number | **Yes** | Field longitude coordinate (e.g., `73.8567`) |
| `farmerNotes` | String | No | Optional farmer observations or field symptoms |

---

#### Response Schema (`AssessmentResponse`) (200 OK)
```json
{
  "assessmentId": "as-assess-20261011-849201",
  "generatedAt": "2026-10-11T05:15:00.000Z",
  "mode": "live",
  "location": {
    "latitude": 18.5204,
    "longitude": 73.8567,
    "district": "Pune",
    "state": "Maharashtra",
    "country": "India"
  },
  "diagnosis": {
    "cropIdentified": "Tomato",
    "cropGrowthStage": "Fruiting",
    "status": "candidate_detected",
    "primaryCandidate": {
      "name": "Late Blight",
      "scientificName": "Phytophthora infestans",
      "confidence": 0.84,
      "severity": "moderate"
    },
    "secondaryCandidates": [
      {
        "name": "Early Blight",
        "scientificName": "Alternaria solani",
        "confidence": 0.32
      }
    ],
    "imageEvidence": [
      "Water-soaked dark lesions observed on upper canopy leaves",
      "White fungal sporulation potential on leaf undersides under high humidity"
    ],
    "imageQuality": {
      "clarity": "good",
      "warning": null
    },
    "uncertaintyNotes": "Symptoms resemble early-stage physiological leaf curl; micro-climate correlation recommended."
  },
  "weather": {
    "provider": "open-meteo",
    "retrievedAt": "2026-10-11T05:14:30.000Z",
    "current": {
      "temperatureC": 24.2,
      "relativeHumidity": 88,
      "precipitationMm": 1.2,
      "weatherCondition": "Overcast with light rain"
    },
    "hourlyForecast": [
      {
        "time": "2026-10-11T06:00:00.000Z",
        "temperatureC": 23.5,
        "relativeHumidity": 91,
        "precipitationProbability": 70,
        "precipitationMm": 0.8
      }
    ]
  },
  "riskAssessment": {
    "overallRiskLevel": "high",
    "riskIndex": 78,
    "modelStatus": "calculated",
    "keyDrivers": [
      "Continuous relative humidity > 85% forecast for next 36 hours",
      "Optimal fungal spore germination temperature window (18°C–22°C)"
    ],
    "interventionWindow": {
      "recommendedActionBy": "2026-10-12T10:00:00.000Z",
      "reason": "Risk peaks before expected heavy dew formation"
    },
    "curve": [
      {
        "timestamp": "2026-10-11T06:00:00.000Z",
        "hourLabel": "Today 06:00",
        "riskScore": 62,
        "temperatureC": 23.5,
        "relativeHumidity": 91,
        "category": "moderate"
      },
      {
        "timestamp": "2026-10-11T12:00:00.000Z",
        "hourLabel": "Today 12:00",
        "riskScore": 75,
        "temperatureC": 25.1,
        "relativeHumidity": 84,
        "category": "high"
      },
      {
        "timestamp": "2026-10-11T18:00:00.000Z",
        "hourLabel": "Today 18:00",
        "riskScore": 84,
        "temperatureC": 21.8,
        "relativeHumidity": 94,
        "category": "high"
      },
      {
        "timestamp": "2026-10-12T00:00:00.000Z",
        "hourLabel": "Tomorrow 00:00",
        "riskScore": 78,
        "temperatureC": 19.4,
        "relativeHumidity": 95,
        "category": "high"
      },
      {
        "timestamp": "2026-10-12T06:00:00.000Z",
        "hourLabel": "Tomorrow 06:00",
        "riskScore": 70,
        "temperatureC": 20.2,
        "relativeHumidity": 90,
        "category": "moderate"
      },
      {
        "timestamp": "2026-10-12T12:00:00.000Z",
        "hourLabel": "Tomorrow 12:00",
        "riskScore": 55,
        "temperatureC": 26.5,
        "relativeHumidity": 72,
        "category": "moderate"
      }
    ]
  },
  "advisory": {
    "headline": "High Risk of Late Blight Progression Due to Prolonged Humidity",
    "severity": "high",
    "culturalPractices": [
      "Prune affected lower leaves to improve canopy airflow",
      "Avoid overhead sprinkler irrigation; switch to drip or furrow irrigation to keep foliage dry"
    ],
    "chemicalWarning": "Do not apply chemical fungicides without field inspection confirmation. If symptoms spread across >10% of plants, consult an authorized extension officer for targeted preventative bio-fungicides.",
    "recheckSchedule": "Inspect crop in 24 hours (Tomorrow morning before 09:00 AM)",
    "verifiedSources": [
      "ICAR-Indian Institute of Horticultural Research Late Blight Advisory",
      "FAO Integrated Pest Management Guidelines"
    ]
  }
}
```

---

## 3. Error Responses

```json
{
  "error": {
    "code": "INVALID_IMAGE | MISSING_COORDINATES | MODEL_UNAVAILABLE | UPSTREAM_WEATHER_FAILURE",
    "message": "Human-readable explanation of error.",
    "details": {}
  }
}
```
