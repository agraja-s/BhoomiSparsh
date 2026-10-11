import React, { useState, useRef, useEffect } from 'react'
import { assessmentService } from '../../services/assessmentService'
import {
  Camera,
  Upload,
  X,
  MapPin,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Leaf,
  CloudSun,
  Bookmark,
  Calendar,
  Layers,
  Info,
  Sparkles,
  PhoneCall,
  CheckSquare,
  Square,
  Clock,
  ShieldAlert,
  Languages,
  MessageSquare,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import type { Language } from '../../utils/translations'
import type {
  AssessmentResponse,
  ImmediateActionStep,
  UrgencyInfo,
  MultilingualText,
} from '../../types/assessment'
import { AssessmentFeedbackModal } from './AssessmentFeedbackModal'
import { EvaluationLoopModal } from './EvaluationLoopModal'

export interface CheckMyCropViewProps {
  language: Language
  onCheckWeatherRisk: () => void
  onBackToDashboard: () => void
}

export type PlantPart = 'Leaf' | 'Stem' | 'Fruit' | 'Whole Plant'

export interface DiagnosisOutcome {
  diseaseName: string
  diseaseNameLocal: string
  scientificName: string
  cropType: string
  cropTypeLocal: string
  growthStage: string
  growthStageLocal: string
  plantPart: string
  confidence: number
  status: 'detected' | 'healthy' | 'uncertain'
  severity: 'low' | 'moderate' | 'high' | 'critical'
  visibleSymptoms: string[]
  whatFarmerSees: string
  isItSerious: string
  immediateActions: ImmediateActionStep[]
  urgency?: UrgencyInfo
  callExpert: boolean
  expertReason: string
  recheckIn: string
  alternatives: { name: string; probability: number }[]
  qualityWarning: string | null
  uncertaintyNotes: string
  recommendedNextStep: string
}

function getLocalized(
  text: MultilingualText | string | undefined | null,
  lang: Language,
  fallback = ''
): string {
  if (!text) return fallback
  if (typeof text === 'string') return text
  return text[lang] || text.en || fallback
}

export const CheckMyCropView: React.FC<CheckMyCropViewProps> = ({
  language: initialLanguage,
  onCheckWeatherRisk,
  onBackToDashboard,
}) => {
  // Multilingual state — farmer can also toggle on the fly
  const [activeLang, setActiveLang] = useState<Language>(initialLanguage)

  // Form State
  const [selectedPart, setSelectedPart] = useState<PlantPart>('Leaf')
  const [selectedField, setSelectedField] = useState('North Plot')
  const [optionalStageHint, setOptionalStageHint] = useState('')
  const [symptomNotes, setSymptomNotes] = useState(
    'Noticed water-soaked dark spots on lower foliage after rainfall.'
  )
  const [photoLocation] = useState('Pune District, Maharashtra (18.52° N, 73.85° E)')

  // Image Upload State
  const [imagePreview, setImagePreview] = useState<string | null>('/potato_crop.jpg')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState<number>(0)
  const [rawResponse, setRawResponse] = useState<AssessmentResponse | null>(null)
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisOutcome | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSaved, setIsSaved] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false)

  // Sync initial language changes from parent layout
  useEffect(() => {
    setActiveLang(initialLanguage)
  }, [initialLanguage])

  // Re-map outcome whenever active language changes
  useEffect(() => {
    if (!rawResponse) return
    mapResponseToOutcome(rawResponse, activeLang)
  }, [activeLang, rawResponse])

  const mapResponseToOutcome = (res: AssessmentResponse, lang: Language) => {
    const report = res.farmerReport
    const diag = res.diagnosis
    const primary = diag?.primaryCandidate
    const imageQuality = diag?.imageQuality

    const cropEn = getLocalized(report?.cropIdentified, 'en', diag?.cropIdentified || 'Crop')
    const cropLocal = getLocalized(report?.cropIdentified, lang, cropEn)

    const stageEn = getLocalized(report?.growthStage, 'en', diag?.cropGrowthStage || 'Vegetative')
    const stageLocal = getLocalized(report?.growthStage, lang, stageEn)

    const diseaseEn = getLocalized(
      report?.diagnosis?.diseaseName,
      'en',
      primary?.name || 'Inconclusive'
    )
    const diseaseLocal = getLocalized(report?.diagnosis?.diseaseName, lang, diseaseEn)

    const symptoms = report?.diagnosis?.whatFarmerSees
      ? [getLocalized(report.diagnosis.whatFarmerSees, lang)]
      : diag?.imageEvidence && diag.imageEvidence.length > 0
        ? diag.imageEvidence
        : ['Visual symptoms identified on plant foliage']

    const actions =
      report?.immediateActions && report.immediateActions.length > 0
        ? report.immediateActions
        : (res.advisory?.culturalPractices || []).map((practice, idx) => ({
            step: idx + 1,
            en: practice,
            hi: practice,
            mr: practice,
          }))

    const expertReason =
      lang === 'mr'
        ? report?.expertReasonMr || report?.expertReasonEn || 'Severe disease spread detected'
        : lang === 'hi'
          ? report?.expertReasonHi || report?.expertReasonEn || 'Severe disease spread detected'
          : report?.expertReasonEn || 'Severe disease spread detected'

    const uncertaintyNotes = getLocalized(
      report?.uncertaintyNote,
      lang,
      diag?.uncertaintyNotes ||
        (imageQuality?.clarity === 'poor'
          ? 'Image quality was low for a confident diagnosis. Please retake photo in daylight.'
          : 'AI diagnosis provides preliminary indicators. Always verify physically in the field.')
    )

    setDiagnosisResult({
      diseaseName: diseaseEn,
      diseaseNameLocal: diseaseLocal,
      scientificName: report?.diagnosis?.scientificName || primary?.scientificName || '',
      cropType: cropEn,
      cropTypeLocal: cropLocal,
      growthStage: stageEn,
      growthStageLocal: stageLocal,
      plantPart: selectedPart,
      confidence: report?.diagnosis?.confidence ?? primary?.confidence ?? 0.84,
      status:
        (report?.status || diag?.status) === 'healthy'
          ? 'healthy'
          : (report?.status || diag?.status) === 'candidate_detected'
            ? 'detected'
            : 'uncertain',
      severity: report?.diagnosis?.severity || primary?.severity || 'moderate',
      visibleSymptoms: symptoms,
      whatFarmerSees: getLocalized(report?.diagnosis?.whatFarmerSees, lang, symptoms[0]),
      isItSerious: getLocalized(
        report?.diagnosis?.isItSerious,
        lang,
        'Monitor canopy carefully and inspect surrounding plants.'
      ),
      immediateActions: actions,
      urgency: report?.urgency,
      callExpert: Boolean(report?.callExpert),
      expertReason,
      recheckIn: getLocalized(
        report?.recheckIn,
        lang,
        res.advisory?.recheckSchedule || 'Inspect again tomorrow morning'
      ),
      alternatives: (diag?.secondaryCandidates ?? []).map((c) => ({
        name: c.name,
        probability: c.confidence ?? 0,
      })),
      qualityWarning:
        lang === 'mr'
          ? report?.imageQuality?.warningMr || imageQuality?.warning || null
          : lang === 'hi'
            ? report?.imageQuality?.warningHi || imageQuality?.warning || null
            : report?.imageQuality?.warningEn || imageQuality?.warning || null,
      uncertaintyNotes,
      recommendedNextStep:
        actions[0] ? getLocalized(actions[0], lang) : res.advisory?.headline || 'Inspect crop canopy.',
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      setDiagnosisResult(null)
      setRawResponse(null)
      setIsSaved(false)
      setCompletedSteps([])
    }
  }

  const toggleStepCompleted = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    )
  }

  const handleAnalyzeCrop = async () => {
    if (!imageFile && !imagePreview) {
      setAnalysisError('Please take or upload a crop photo before analyzing.')
      return
    }

    setIsAnalyzing(true)
    setAnalysisStep(1)
    setDiagnosisResult(null)
    setAnalysisError(null)
    setCompletedSteps([])

    const coordMatch = photoLocation.match(/\(([\d.]+)°\s*N,\s*([\d.]+)°\s*E\)/)
    const latitude = coordMatch ? parseFloat(coordMatch[1]) : 18.5204
    const longitude = coordMatch ? parseFloat(coordMatch[2]) : 73.8567

    const step2Timer = setTimeout(() => setAnalysisStep(2), 1200)

    try {
      let fileToSubmit = imageFile
      // Fallback: If no file uploaded but preview is set, fetch local placeholder as file
      if (!fileToSubmit && imagePreview) {
        try {
          const fetched = await fetch(imagePreview)
          const blob = await fetched.blob()
          fileToSubmit = new File([blob], 'crop_sample.jpg', { type: blob.type || 'image/jpeg' })
        } catch {
          fileToSubmit = new File(['mock_image'], 'crop_sample.jpg', { type: 'image/jpeg' })
        }
      }

      if (!fileToSubmit) {
        throw new Error('Please select an image file to analyze.')
      }

      const response = await assessmentService.submitAssessment(
        {
          image: fileToSubmit,
          latitude,
          longitude,
          farmerNotes: symptomNotes || undefined,
          growthStage: optionalStageHint
            ? (optionalStageHint as import('../../types/assessment').GrowthStage)
            : undefined,
        },
        imagePreview ?? undefined
      )

      clearTimeout(step2Timer)
      setAnalysisStep(3)
      setRawResponse(response)
      mapResponseToOutcome(response, activeLang)
    } catch (err: unknown) {
      clearTimeout(step2Timer)
      const message = err instanceof Error ? err.message : 'Assessment failed. Please try again.'
      setAnalysisError(message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Language display labels
  const langLabels = {
    en: 'English',
    hi: 'हिंदी (Hindi)',
    mr: 'मराठी (Marathi)',
  }

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-[#E0E6DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[#287A4B] uppercase tracking-wider block mb-1">
            AI Crop Health Diagnostic • Bhumisparsh
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2D] tracking-tight">
            Check My Crop Health
          </h1>
          <p className="text-sm text-[#66756A] mt-1">
            Automatic crop identification, instant symptom analysis, and farmer-friendly advice in 3 languages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher Bar */}
          <div className="flex items-center bg-[#F8F7EF] p-1 rounded-xl border border-[#E0E6DC] text-xs">
            <Languages className="w-3.5 h-3.5 text-[#287A4B] ml-1.5 mr-1" />
            {(['en', 'hi', 'mr'] as Language[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setActiveLang(l)}
                title={langLabels[l]}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer text-xs ${
                  activeLang === l
                    ? 'bg-[#123D2D] text-white shadow-2xs'
                    : 'text-[#66756A] hover:text-[#123D2D]'
                }`}
              >
                {l === 'en' ? 'EN' : l === 'hi' ? 'हिं' : 'मरा'}
              </button>
            ))}
            {/* Learning Loop Benchmark Pill */}
            <button
              type="button"
              onClick={() => setIsEvaluationModalOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-[#E0E6DC] bg-white text-[#123D2D] font-bold text-xs hover:border-[#287A4B] flex items-center gap-1.5 shadow-2xs cursor-pointer ml-1"
              title="Inspect AI Evaluation & Rule Evolution Pipeline"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">AI Learning Loop</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onBackToDashboard}
            className="rounded-xl text-xs font-bold text-[#123D2D]"
          >
            Overview
          </Button>
        </div>
      </div>

      {/* Main Diagnostic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Crop Metadata */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upload Area Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E0E6DC] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-[#123D2D] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#287A4B]" />
                Plant Photograph
              </h2>
              <span className="text-[11px] font-semibold text-[#287A4B] bg-[#E9F1E6] px-2.5 py-0.5 rounded-full">
                AI Vision Ready
              </span>
            </div>

            {/* Hidden inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#E0E6DC] bg-[#F8F7EF]">
                <img
                  src={imagePreview}
                  alt="Crop preview"
                  className="w-full h-64 object-cover"
                />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/65 backdrop-blur-xs p-2.5 rounded-xl text-white text-xs">
                  <span className="truncate max-w-[200px]">
                    {imageFile ? imageFile.name : 'potato_leaf_sample.jpg'}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setImageFile(null)
                        setDiagnosisResult(null)
                        setRawResponse(null)
                      }}
                      className="p-1 rounded-lg hover:bg-rose-500/40 text-rose-300 cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#E0E6DC] hover:border-[#287A4B] rounded-2xl p-8 text-center cursor-pointer bg-[#F8F7EF]/50 hover:bg-[#F8F7EF] transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E9F1E6] text-[#287A4B] mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#123D2D]">
                    Click to upload or drag & drop leaf photo
                  </p>
                  <p className="text-xs text-[#66756A] mt-1">
                    Supports JPG, PNG or WebP up to 10MB
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      cameraInputRef.current?.click()
                    }}
                    leftIcon={<Camera className="w-3.5 h-3.5" />}
                    className="rounded-xl text-xs"
                  >
                    Take Photo
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-[#123D2D] hover:bg-[#287A4B] text-white rounded-xl text-xs font-bold"
                  >
                    Browse Files
                  </Button>
                </div>
              </div>
            )}

            {/* Photo Metadata tags */}
            <div className="flex items-center gap-3 text-xs text-[#66756A] pt-1 border-t border-[#E0E6DC]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#287A4B]" />
                Captured: Today
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#6BA66B]" />
                {photoLocation}
              </span>
            </div>
          </div>

          {/* Plant Inspection Information */}
          <div className="bg-white p-6 rounded-3xl border border-[#E0E6DC] shadow-2xs space-y-4 text-xs">
            <h2 className="text-sm font-extrabold text-[#123D2D] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#287A4B]" />
              Inspection Details
            </h2>

            {/* AI Auto-Recognition Notice */}
            <div className="p-3.5 rounded-2xl bg-[#E9F1E6]/80 border border-[#287A4B]/20 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#287A4B] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#123D2D] block">
                  Automatic Crop & Disease Recognition
                </span>
                <p className="text-[11px] text-[#66756A] mt-0.5 leading-relaxed">
                  No need to manually choose your crop type. AgriSentry automatically identifies
                  whether your crop is <strong>Tomato, Potato, Rice, Wheat, Cotton, Chilli</strong>, or others
                  and detects the exact growth stage from the image.
                </p>
              </div>
            </div>

            {/* Plant Part Selector */}
            <div>
              <label className="block font-bold text-[#1F3027] mb-1.5">
                Plant Part Photographed *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Leaf', 'Stem', 'Fruit', 'Whole Plant'] as PlantPart[]).map((part) => (
                  <button
                    key={part}
                    type="button"
                    onClick={() => setSelectedPart(part)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                      selectedPart === part
                        ? 'bg-[#287A4B] text-white border-[#287A4B] shadow-2xs'
                        : 'bg-[#F8F7EF] text-[#1F3027] border-[#E0E6DC] hover:border-[#287A4B]'
                    }`}
                  >
                    {part}
                  </button>
                ))}
              </div>
            </div>

            {/* Field Plot + Optional Stage Hint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block font-bold text-[#1F3027] mb-1">
                  Field / Plot
                </label>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E0E6DC] bg-white text-xs text-[#1F3027] outline-none"
                >
                  <option value="North Plot">North Plot (Main Acre)</option>
                  <option value="East Terrace">East Terrace (Canal Border)</option>
                  <option value="South Valley">South Valley (Well Side)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1F3027] mb-1">
                  Optional Growth Stage Hint
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flowering, Seedling, Fruiting..."
                  value={optionalStageHint}
                  onChange={(e) => setOptionalStageHint(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E0E6DC] text-xs text-[#1F3027] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1F3027] mb-1">
                Optional Notes for AI Pathologist
              </label>
              <textarea
                rows={2}
                value={symptomNotes}
                onChange={(e) => setSymptomNotes(e.target.value)}
                placeholder="Mention recent rainfall, yellow spots, leaf curling, or wilting symptoms..."
                className="w-full px-3 py-2 rounded-xl border border-[#E0E6DC] text-xs text-[#1F3027] outline-none resize-none"
              />
            </div>

            {/* Error Banner */}
            {analysisError && (
              <div className="flex items-start gap-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Analysis Could Not Complete</p>
                  <p className="mt-0.5 text-rose-700">{analysisError}</p>
                </div>
              </div>
            )}

            {/* Primary Analysis CTA */}
            <Button
              size="lg"
              onClick={handleAnalyzeCrop}
              disabled={isAnalyzing}
              className="w-full bg-[#123D2D] hover:bg-[#287A4B] text-white font-extrabold text-sm py-4 rounded-2xl shadow-sm cursor-pointer"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Crop & Disease...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  Analyze My Crop
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Right Column: Processing State & Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Calm Processing State Indicator */}
          {isAnalyzing && (
            <div className="bg-white p-6 rounded-3xl border border-[#E0E6DC] shadow-xs space-y-4 text-xs animate-in fade-in">
              <h3 className="font-extrabold text-sm text-[#123D2D] flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#287A4B] animate-spin" />
                Analyzing Crop Symptoms
              </h3>
              <p className="text-[#66756A]">
                AI Pathologist is identifying the crop species, visual lesions, and risk factors.
              </p>

              <div className="space-y-3 pt-2">
                <div
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                    analysisStep >= 1 ? 'bg-[#E9F1E6] text-[#123D2D]' : 'text-[#66756A]'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${analysisStep >= 1 ? 'text-[#287A4B]' : 'text-[#66756A]/40'}`}
                  />
                  <span className="font-semibold">Identifying crop type & growth stage</span>
                </div>
                <div
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                    analysisStep >= 2 ? 'bg-[#E9F1E6] text-[#123D2D]' : 'text-[#66756A]'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${analysisStep >= 2 ? 'text-[#287A4B]' : 'text-[#66756A]/40'}`}
                  />
                  <span className="font-semibold">Detecting pathogen symptoms & severity</span>
                </div>
                <div
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                    analysisStep >= 3 ? 'bg-[#E9F1E6] text-[#123D2D]' : 'text-[#66756A]'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${analysisStep >= 3 ? 'text-[#287A4B]' : 'text-[#66756A]/40'}`}
                  />
                  <span className="font-semibold">Synthesizing multilingual farmer advice</span>
                </div>
              </div>
            </div>
          )}

          {/* Results Panel */}
          {diagnosisResult && !isAnalyzing ? (
            <div className="bg-white p-6 rounded-3xl border border-[#E0E6DC] shadow-xs space-y-5 text-xs animate-in fade-in">
              {/* Result Top Bar with Language Tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E0E6DC]">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[#66756A]">
                    Language:
                  </span>
                  <div className="flex bg-[#F8F7EF] rounded-lg p-0.5 border border-[#E0E6DC]">
                    {(['en', 'hi', 'mr'] as Language[]).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setActiveLang(l)}
                        className={`px-2 py-0.5 rounded-md font-bold text-[11px] cursor-pointer transition-colors ${
                          activeLang === l
                            ? 'bg-[#287A4B] text-white shadow-2xs'
                            : 'text-[#66756A] hover:text-[#123D2D]'
                        }`}
                      >
                        {l === 'en' ? 'EN' : l === 'hi' ? 'हिंदी' : 'मराठी'}
                      </button>
                    ))}
                  </div>
                </div>

                <Badge
                  variant={
                    diagnosisResult.severity === 'critical' || diagnosisResult.severity === 'high'
                      ? 'destructive'
                      : 'warning'
                  }
                  dot
                  className="font-bold text-[11px]"
                >
                  {Math.round(diagnosisResult.confidence * 100)}% Confidence
                </Badge>
              </div>

              {/* Identified Crop & Growth Stage Banner */}
              <div className="p-3.5 rounded-2xl bg-[#E9F1E6]/70 border border-[#287A4B]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#287A4B] block">
                    AI Detected Crop & Stage
                  </span>
                  <div className="text-base font-extrabold text-[#123D2D] mt-0.5 flex items-center gap-2">
                    <span>{diagnosisResult.cropTypeLocal}</span>
                    {diagnosisResult.cropTypeLocal !== diagnosisResult.cropType && (
                      <span className="text-xs text-[#66756A] font-normal">
                        ({diagnosisResult.cropType})
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#66756A] font-medium block mt-0.5">
                    Stage: {diagnosisResult.growthStageLocal} • {diagnosisResult.plantPart}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white border border-[#287A4B]/30 flex items-center justify-center text-[#287A4B] shadow-2xs">
                  <Leaf className="w-5 h-5" />
                </div>
              </div>

              {/* Identified Disease Headline */}
              <div>
                <span className="text-[11px] font-semibold text-[#66756A] block">
                  Diagnosis / रोग निदान:
                </span>
                <h3 className="text-xl font-extrabold text-[#123D2D] mt-0.5">
                  {diagnosisResult.diseaseNameLocal}
                </h3>
                {diagnosisResult.diseaseNameLocal !== diagnosisResult.diseaseName && (
                  <span className="text-xs text-[#66756A] font-medium block mt-0.5">
                    ({diagnosisResult.diseaseName})
                  </span>
                )}
                {diagnosisResult.scientificName && (
                  <span className="text-xs text-[#287A4B] italic block mt-0.5">
                    {diagnosisResult.scientificName}
                  </span>
                )}
              </div>

              {/* Urgency Alert Box */}
              {diagnosisResult.urgency && (
                <div
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                    diagnosisResult.urgency.level === 'critical'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : diagnosisResult.urgency.level === 'high'
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <Clock
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      diagnosisResult.urgency.level === 'critical'
                        ? 'text-rose-600'
                        : diagnosisResult.urgency.level === 'high'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                    }`}
                  />
                  <div>
                    <span className="font-extrabold text-xs block uppercase tracking-wide">
                      Urgency Level: {diagnosisResult.urgency.level}
                    </span>
                    <p className="text-xs font-semibold mt-0.5">
                      {activeLang === 'mr'
                        ? diagnosisResult.urgency.actByMr
                        : activeLang === 'hi'
                          ? diagnosisResult.urgency.actByHi
                          : diagnosisResult.urgency.actByEn}
                    </p>
                  </div>
                </div>
              )}

              {/* Call Expert Helpline Banner */}
              {diagnosisResult.callExpert && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Agronomist Consultation Advised</span>
                  </div>
                  <p className="text-xs text-amber-900/90 leading-relaxed">
                    {diagnosisResult.expertReason}
                  </p>
                  <a
                    href="tel:18001801551"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Call Kisan Call Center (1800-180-1551)
                  </a>
                </div>
              )}

              {/* Plain-Language Symptom & Severity Details */}
              <div className="space-y-3 pt-1">
                <div className="p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC] space-y-1">
                  <span className="font-bold text-[#1F3027] block text-xs">
                    👀 What the AI Observed / काय दिसले:
                  </span>
                  <p className="text-[#66756A] text-xs leading-relaxed">
                    {diagnosisResult.whatFarmerSees}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC] space-y-1">
                  <span className="font-bold text-[#1F3027] block text-xs">
                    ⚠️ Is this serious? / हे गंभीर आहे का?
                  </span>
                  <p className="text-[#66756A] text-xs leading-relaxed">
                    {diagnosisResult.isItSerious}
                  </p>
                </div>
              </div>

              {/* Immediate Farmer Actions Checklist */}
              {diagnosisResult.immediateActions.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#123D2D] text-xs">
                      ✅ Immediate Action Steps (कृती):
                    </span>
                    <span className="text-[11px] text-[#66756A]">
                      {completedSteps.length} of {diagnosisResult.immediateActions.length} done
                    </span>
                  </div>

                  <div className="space-y-2">
                    {diagnosisResult.immediateActions.map((action) => {
                      const isDone = completedSteps.includes(action.step)
                      const text = getLocalized(action, activeLang)
                      return (
                        <div
                          key={action.step}
                          onClick={() => toggleStepCompleted(action.step)}
                          className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                            isDone
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                              : 'bg-white border-[#E0E6DC] hover:border-[#287A4B] text-[#1F3027]'
                          }`}
                        >
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-[#66756A] shrink-0 mt-0.5" />
                          )}
                          <div className="text-xs leading-relaxed">
                            <span className="font-bold mr-1">Step {action.step}:</span>
                            <span className={isDone ? 'line-through text-emerald-800' : ''}>
                              {text}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Recheck Schedule */}
              <div className="p-3 rounded-2xl bg-[#E9F1E6] border border-[#287A4B]/20 text-[#123D2D] flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#287A4B] shrink-0" />
                <span className="text-xs font-semibold">
                  <strong>Recheck Field:</strong> {diagnosisResult.recheckIn}
                </span>
              </div>

              {/* Scientific Honesty Disclaimer */}
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Farmer Trust & Safety Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  {diagnosisResult.uncertaintyNotes}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-[#E0E6DC]">
                {/* n8n Feedback Trigger */}
                <Button
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="w-full bg-[#123D2D] hover:bg-[#287A4B] text-white font-extrabold text-xs py-3 rounded-xl shadow-xs cursor-pointer"
                  leftIcon={<MessageSquare className="w-4 h-4 text-[#6BA66B]" />}
                >
                  Record Field Outcome & Feedback (n8n Loop)
                </Button>

                <Button
                  onClick={onCheckWeatherRisk}
                  className="w-full bg-[#347CB4] hover:bg-[#287A4B] text-white font-extrabold text-xs py-3 rounded-xl shadow-xs cursor-pointer"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Check 48-Hour Micro-Climate Weather Risk
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsSaved(true)}
                    disabled={isSaved}
                    className="rounded-xl text-xs font-bold border-[#E0E6DC] text-[#123D2D] cursor-pointer"
                    leftIcon={<Bookmark className="w-3.5 h-3.5 text-[#287A4B]" />}
                  >
                    {isSaved ? 'Saved to History' : 'Save Diagnosis'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setImagePreview(null)
                      setImageFile(null)
                      setDiagnosisResult(null)
                      setRawResponse(null)
                      setCompletedSteps([])
                    }}
                    className="rounded-xl text-xs font-bold border-[#E0E6DC] text-[#66756A] hover:text-[#123D2D] cursor-pointer"
                  >
                    Check Another Photo
                  </Button>
                </div>
              </div>
            </div>
          ) : !isAnalyzing ? (
            /* Idle Reassurance Card */
            <div className="bg-white p-6 rounded-3xl border border-[#E0E6DC] shadow-2xs space-y-4 text-xs text-[#66756A]">
              <div className="w-10 h-10 rounded-2xl bg-[#E9F1E6] flex items-center justify-center text-[#287A4B]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-[#123D2D]">
                How AgriSentry Vision AI Works
              </h3>
              <p className="leading-relaxed">
                Our vision model analyzes discoloration, spot geometry, and chlorotic halos against
                agricultural pathogen reference databases across India.
              </p>
              <div className="space-y-2 pt-2 border-t border-[#E0E6DC] text-[11px]">
                <p className="flex items-center gap-1.5 text-[#1F3027] font-semibold">
                  <Leaf className="w-3.5 h-3.5 text-[#287A4B]" />
                  Step 1: AI auto-identifies your crop and growth stage
                </p>
                <p className="flex items-center gap-1.5 text-[#1F3027] font-semibold">
                  <CloudSun className="w-3.5 h-3.5 text-[#347CB4]" />
                  Step 2: Instant symptom and urgency assessment
                </p>
                <p className="flex items-center gap-1.5 text-[#1F3027] font-semibold">
                  <Info className="w-3.5 h-3.5 text-[#E5A52C]" />
                  Step 3: Actionable checklist in Hindi, Marathi & English
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Assessment Feedback Modal (n8n Workflow 1) */}
      {rawResponse && (
        <AssessmentFeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          assessmentId={rawResponse.assessmentId}
          cropType={diagnosisResult?.cropType || 'Tomato'}
          initialDisease={diagnosisResult?.diseaseName}
          language={activeLang}
        />
      )}

      {/* Evaluation & Controlled Learning Loop Modal (n8n Workflow 2) */}
      <EvaluationLoopModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        language={activeLang}
      />
    </div>
  )
}

export default CheckMyCropView
