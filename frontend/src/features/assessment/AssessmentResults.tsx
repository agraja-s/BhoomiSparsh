import React from 'react'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Thermometer,
  Droplets,
  CloudRain,
  CloudSun,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sprout,
  Layers,
  Leaf,
  Activity,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import type { Language } from '../../utils/translations'
import { translations } from '../../utils/translations'
import type { AssessmentResponse } from '../../types/assessment'

export interface AssessmentResultsProps {
  assessment: AssessmentResponse
  language: Language
  onBack: () => void
  onNewAssessment: () => void
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  assessment,
  language,
  onBack,
  onNewAssessment,
}) => {
  const t = translations[language]

  const { diagnosis, weather, riskAssessment, advisory, location } = assessment

  const overallRiskVariant =
    riskAssessment.overallRiskLevel === 'high'
      ? 'risk-high'
      : riskAssessment.overallRiskLevel === 'moderate'
      ? 'risk-moderate'
      : 'risk-low'

  const overallRiskBg =
    riskAssessment.overallRiskLevel === 'high'
      ? 'bg-rose-50 border-rose-200 text-rose-900'
      : riskAssessment.overallRiskLevel === 'moderate'
      ? 'bg-amber-50 border-amber-200 text-amber-900'
      : 'bg-emerald-50 border-emerald-200 text-emerald-900'

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#1B5E20] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToDashboard}</span>
        </button>

        <div className="flex items-center gap-2">
          {assessment.mode === 'mock' && (
            <Badge variant="mock" dot>
              {t.mockNotice}
            </Badge>
          )}
          <Button
            size="sm"
            variant="forest"
            onClick={onNewAssessment}
            className="rounded-xl"
          >
            + {t.startAssessment}
          </Button>
        </div>
      </div>

      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xs ${overallRiskBg}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={overallRiskVariant} dot className="text-xs px-3 py-1 font-bold">
                {riskAssessment.overallRiskLevel.toUpperCase()} RISK LEVEL
              </Badge>
              <span className="text-xs text-slate-500 font-mono">
                ID: {assessment.assessmentId}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {advisory.headline}
            </h1>
            <p className="text-sm opacity-90 max-w-2xl leading-relaxed">
              Assessed for {diagnosis.cropIdentified} ({diagnosis.cropGrowthStage} stage) in {location.district || 'Target Field'}.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-current/20 shadow-xs flex flex-col items-center justify-center shrink-0 min-w-[140px]">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Risk Index
            </span>
            <span className="text-4xl font-extrabold font-mono mt-1 text-slate-900">
              {riskAssessment.riskIndex}
              <span className="text-base text-slate-400 font-normal">/100</span>
            </span>
            <span className="text-[11px] font-semibold mt-0.5 text-slate-600">
              {riskAssessment.overallRiskLevel.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: CROP & IMAGE DIAGNOSIS */}
      {/* ========================================================= */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#1B5E20]">
              <Leaf className="w-5 h-5" />
              <CardTitle>{t.cropDiagnosis}</CardTitle>
            </div>
            <Badge
              variant={
                diagnosis.status === 'candidate_detected'
                  ? 'risk-high'
                  : diagnosis.status === 'healthy'
                  ? 'risk-low'
                  : 'inconclusive'
              }
            >
              {diagnosis.status === 'candidate_detected'
                ? t.candidateDetected
                : diagnosis.status === 'healthy'
                ? t.healthyStatus
                : t.inconclusiveStatus}
            </Badge>
          </div>
          <CardDescription>
            Visual symptom detection based on uploaded leaf photography.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Image Preview */}
            <div className="lg:col-span-5 space-y-3">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 max-h-64 flex items-center justify-center shadow-xs">
                {assessment.imageUrl ? (
                  <img
                    src={assessment.imageUrl}
                    alt="Analyzed crop specimen"
                    className="w-full h-full object-cover max-h-64"
                  />
                ) : (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <Leaf className="w-8 h-8 mx-auto text-emerald-400" />
                    <p className="text-xs">Photograph Evaluated by Engine</p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Crop: <strong className="text-slate-800">{diagnosis.cropIdentified}</strong></span>
                <span>Stage: <strong className="text-slate-800">{diagnosis.cropGrowthStage}</strong></span>
              </div>
            </div>

            {/* Right: Diagnostic Candidates & Evidence */}
            <div className="lg:col-span-7 space-y-4">
              {diagnosis.primaryCandidate && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900">
                      {diagnosis.primaryCandidate.name}
                    </h4>
                    {diagnosis.primaryCandidate.confidence != null && (
                      <span className="text-xs font-mono font-bold text-[#1B5E20] bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {Math.round(diagnosis.primaryCandidate.confidence * 100)}% Confidence
                      </span>
                    )}
                  </div>
                  {diagnosis.primaryCandidate.scientificName && (
                    <p className="text-xs text-slate-600 italic">
                      {diagnosis.primaryCandidate.scientificName}
                    </p>
                  )}
                </div>
              )}

              {/* Observed Image Evidence */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.imageEvidenceLabel}
                </h5>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  {diagnosis.imageEvidence.map((ev, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20] shrink-0 mt-2" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Uncertainty Notes */}
              {diagnosis.uncertaintyNotes && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block mb-0.5">{t.uncertaintyNotesLabel}</strong>
                    <span>{diagnosis.uncertaintyNotes}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* SECTION 2: UPCOMING MICRO-CLIMATIC WEATHER */}
      {/* ========================================================= */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-700">
              <CloudSun className="w-5 h-5" />
              <CardTitle>{t.weatherForecastTitle}</CardTitle>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              Provider: {weather.provider}
            </span>
          </div>
          <CardDescription>
            Hyper-local environmental forecast used to model pathogen sporulation risk.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Current weather metric widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-100 text-orange-700">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-600 block">{t.temperature}</span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  {weather.current.temperatureC}°C
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-600 block">{t.humidity}</span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  {weather.current.relativeHumidity}%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-600 block">{t.precipitation}</span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  {weather.current.precipitationMm ?? 0} mm
                </span>
              </div>
            </div>
          </div>

          {/* Hourly Timeline Mini-Cards */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Upcoming 48-Hour Micro-Climate Cadence
            </h5>
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {weather.hourlyForecast.slice(0, 8).map((hf, i) => (
                <div
                  key={i}
                  className="min-w-[110px] p-3 rounded-xl border border-slate-200 bg-white shadow-2xs text-center space-y-1 shrink-0"
                >
                  <span className="text-[11px] font-mono text-slate-500 block truncate">
                    {new Date(hf.time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </span>
                  <span className="text-sm font-bold text-slate-900 block">
                    {hf.temperatureC}°C
                  </span>
                  <span className="text-xs font-semibold text-sky-700 block">
                    {hf.relativeHumidity}% RH
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* SECTION 3: DISEASE-RISK TIMELINE (RECHARTS VISUALIZATION) */}
      {/* ========================================================= */}
      <Card className="border-emerald-700/20 shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[#1B5E20]">
              <Activity className="w-5 h-5" />
              <CardTitle>{t.riskTimelineTitle}</CardTitle>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>Low (&lt;40)</span>
              </span>
              <span className="inline-flex items-center gap-1 text-amber-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Mod (40-69)</span>
              </span>
              <span className="inline-flex items-center gap-1 text-rose-800">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span>High (≥70)</span>
              </span>
            </div>
          </div>
          <CardDescription>{t.riskTimelineSubtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chart Container */}
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={riskAssessment.curve}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B5E20" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1B5E20" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="hourLabel"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-md border border-slate-200 text-xs text-left space-y-1">
                          <p className="font-bold text-slate-900">{data.hourLabel}</p>
                          <p className="font-mono text-[#1B5E20] font-bold">
                            Disease Risk Index: {data.riskScore}/100
                          </p>
                          <p className="text-slate-600">Temp: {data.temperatureC}°C</p>
                          <p className="text-sky-700">Relative Humidity: {data.relativeHumidity}%</p>
                          <Badge
                            variant={
                              data.category === 'high'
                                ? 'risk-high'
                                : data.category === 'moderate'
                                ? 'risk-moderate'
                                : 'risk-low'
                            }
                            className="mt-1"
                          >
                            {data.category.toUpperCase()} RISK
                          </Badge>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <ReferenceLine
                  y={70}
                  stroke="#E11D48"
                  strokeDasharray="3 3"
                  label={{ value: 'High Risk (70)', fill: '#E11D48', fontSize: 10, position: 'insideTopRight' }}
                />
                <ReferenceLine
                  y={40}
                  stroke="#D97706"
                  strokeDasharray="3 3"
                  label={{ value: 'Moderate (40)', fill: '#D97706', fontSize: 10, position: 'insideTopRight' }}
                />
                <Area
                  type="monotone"
                  dataKey="riskScore"
                  stroke="#1B5E20"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#riskGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Intervention Window Card */}
          {riskAssessment.interventionWindow && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-950">
                  {t.interventionWindowLabel}:{' '}
                  {new Date(riskAssessment.interventionWindow.recommendedActionBy!).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {riskAssessment.interventionWindow.reason}
                </p>
              </div>
            </div>
          )}

          {/* Key Drivers */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.keyDriversLabel}
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {riskAssessment.keyDrivers.map((driver, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span>{driver}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* SECTION 4: EXPLAIN THE ASSESSMENT (MULTIMODAL FUSION) */}
      {/* ========================================================= */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-slate-800">
            <Layers className="w-5 h-5 text-[#1B5E20]" />
            <CardTitle>Multimodal Assessment Explanation</CardTitle>
          </div>
          <CardDescription>
            How image observations, environmental forecasts, and biological risk models are fused.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 font-bold block text-sm">
                1. What the Crop Image Suggests
              </strong>
              <p className="leading-relaxed">
                Initial lesion formations resemble {diagnosis.primaryCandidate?.name}. Folia shows localized tissue stress with chlorotic halos, indicating possible active incubation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 font-bold block text-sm">
                2. What the Weather Forecast Indicates
              </strong>
              <p className="leading-relaxed">
                Persistent humidity &gt; 85% paired with night canopy temperatures around 19°C–23°C provides the exact thermodynamic envelope required for rapid fungal sporulation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 font-bold block text-sm">
                3. What the Risk Model Estimates
              </strong>
              <p className="leading-relaxed">
                Disease suitability peaks at {riskAssessment.riskIndex}/100 during overnight hours. This score models environmental favorability, not an unchangeable crop loss guarantee.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 font-bold block text-sm">
                4. What Remains Uncertain
              </strong>
              <p className="leading-relaxed">
                Micro-climate variability across canopy depths cannot be completely known from a single photo. Field scouting before chemical intervention is essential.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* SECTION 5: PRACTICAL ADVISORY */}
      {/* ========================================================= */}
      <Card className="border-[#1B5E20]/30 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-[#1B5E20]">
            <Sprout className="w-5 h-5" />
            <CardTitle>{t.advisoryTitle}</CardTitle>
          </div>
          <CardDescription>
            Gated agricultural interventions designed to protect harvest while eliminating premature chemical spraying.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chemical Warning Banner (DO NOT SPRAY PREMATURELY) */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-900">
                {t.chemicalWarningTitle}
              </h4>
              <p className="text-xs sm:text-sm text-rose-950 leading-relaxed">
                {advisory.chemicalWarning}
              </p>
            </div>
          </div>

          {/* Cultural Practices */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900">
              {t.culturalPracticesTitle}
            </h4>
            <div className="space-y-2">
              {advisory.culturalPractices.map((prac, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                  <span>{prac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recheck Schedule */}
          {advisory.recheckSchedule && (
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-start gap-3 text-sky-950">
              <Calendar className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-sky-900">
                  {t.recheckScheduleTitle}
                </h5>
                <p className="text-sm font-semibold mt-0.5">{advisory.recheckSchedule}</p>
              </div>
            </div>
          )}

          {/* Verified Sources */}
          {advisory.verifiedSources && advisory.verifiedSources.length > 0 && (
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <span className="font-semibold text-slate-700 block">
                {t.verifiedSourcesTitle}:
              </span>
              <ul className="list-disc list-inside space-y-0.5">
                {advisory.verifiedSources.map((src, idx) => (
                  <li key={idx}>{src}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
