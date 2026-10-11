import React, { useState, useRef } from 'react'
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
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import type { Language } from '../../utils/translations'

export interface CheckMyCropViewProps {
  language: Language
  onCheckWeatherRisk: () => void
  onBackToDashboard: () => void
}

export type PlantPart = 'Leaf' | 'Stem' | 'Fruit' | 'Whole Plant'
export type CropOption = 'Potato' | 'Rice' | 'Tomato' | 'Cotton' | 'Other'

export interface DiagnosisOutcome {
  diseaseName: string
  scientificName: string
  cropType: string
  plantPart: string
  confidence: number
  status: 'detected' | 'healthy' | 'uncertain'
  visibleSymptoms: string[]
  alternatives: { name: string; probability: number }[]
  qualityWarning: string | null
  uncertaintyNotes: string
  recommendedNextStep: string
}

export const CheckMyCropView: React.FC<CheckMyCropViewProps> = ({
  language: _language,
  onCheckWeatherRisk,
  onBackToDashboard,
}) => {
  // Form State
  const [selectedCrop, setSelectedCrop] = useState<CropOption>('Potato')
  const [selectedPart, setSelectedPart] = useState<PlantPart>('Leaf')
  const [selectedField, setSelectedField] = useState('North Plot (Potato)')
  const [growthStage, setGrowthStage] = useState('Tuber Initiation (Day 42)')
  const [symptomNotes, setSymptomNotes] = useState(
    'Noticed dark brownish water-soaked spots on the lower leaf margins after 2 days of rain.'
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
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisOutcome | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      setDiagnosisResult(null)
      setIsSaved(false)
    }
  }

  const handleAnalyzeCrop = () => {
    setIsAnalyzing(true)
    setAnalysisStep(1)
    setDiagnosisResult(null)

    // Calm multi-stage progress
    setTimeout(() => {
      setAnalysisStep(2)
      setTimeout(() => {
        setAnalysisStep(3)
        setTimeout(() => {
          setIsAnalyzing(false)
          setDiagnosisResult({
            diseaseName: 'Late Blight (Early Stage)',
            scientificName: 'Phytophthora infestans',
            cropType: selectedCrop,
            plantPart: selectedPart,
            confidence: 0.88,
            status: 'detected',
            visibleSymptoms: [
              'Irregular water-soaked necrotic lesions on leaf margins and tips',
              'Chlorotic pale green halo bordering necrotic tissue',
              'Early signs of whitish downy fungal growth on abaxial (underside) leaf surface',
            ],
            alternatives: [
              { name: 'Early Blight (Alternaria solani)', probability: 0.08 },
              { name: 'Physiological Sunscald / Waterlogging', probability: 0.04 },
            ],
            qualityWarning: null,
            uncertaintyNotes:
              'Symptoms closely match early fungal sporulation. Visual diagnosis is probabilistic; weather observations are required to confirm micro-climatic disease favorability.',
            recommendedNextStep:
              'Inspect underside of lower foliage across North Plot. Prune affected leaves and check local 72-hour weather risk before considering intervention.',
          })
        }, 800)
      }, 900)
    }, 700)
  }

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-[#E0E6DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[#287A4B] uppercase tracking-wider block mb-1">
            AI Crop Health Diagnostic
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2D] tracking-tight">
            Let's check your crop.
          </h1>
          <p className="text-sm text-[#66756A] mt-1">
            Upload a clear photo of the affected plant to identify possible disease symptoms.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onBackToDashboard}
          className="self-start sm:self-auto rounded-xl text-xs font-bold text-[#123D2D]"
        >
          Return to Overview
        </Button>
      </div>

      {/* Main Diagnostic Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Crop Metadata */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upload Area Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E0E6DC] shadow-2xs space-y-4">
            <h2 className="text-sm font-extrabold text-[#123D2D] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#287A4B]" />
              Plant Photograph
            </h2>

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

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/65 backdrop-blur-xs p-2 rounded-xl text-white text-xs">
                  <span className="truncate max-w-[200px]">
                    {imageFile ? imageFile.name : 'potato_field_sample.jpg'}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
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
                Captured: Today 08:30 AM
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#6BA66B]" />
                {photoLocation}
              </span>
            </div>
          </div>

          {/* Form Controls: Crop, Part, Field */}
          <div className="bg-white p-6 rounded-3xl border border-[#E0E6DC] shadow-2xs space-y-4 text-xs">
            <h2 className="text-sm font-extrabold text-[#123D2D] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#287A4B]" />
              Crop & Plant Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1F3027] mb-1.5">
                  Crop Type *
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Potato', 'Tomato', 'Rice', 'Cotton', 'Other'] as CropOption[]).map((crop) => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => setSelectedCrop(crop)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-left ${
                        selectedCrop === crop
                          ? 'bg-[#123D2D] text-white border-[#123D2D]'
                          : 'bg-[#F8F7EF] text-[#1F3027] border-[#E0E6DC] hover:border-[#287A4B]'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1F3027] mb-1.5">
                  Plant Part Inspected *
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Leaf', 'Stem', 'Fruit', 'Whole Plant'] as PlantPart[]).map((part) => (
                    <button
                      key={part}
                      type="button"
                      onClick={() => setSelectedPart(part)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-left ${
                        selectedPart === part
                          ? 'bg-[#287A4B] text-white border-[#287A4B]'
                          : 'bg-[#F8F7EF] text-[#1F3027] border-[#E0E6DC] hover:border-[#287A4B]'
                      }`}
                    >
                      {part}
                    </button>
                  ))}
                </div>
              </div>
            </div>

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
                  <option value="North Plot (Potato)">North Plot — Potato (Kufri Jyoti)</option>
                  <option value="East Terrace (Tomato)">East Terrace — Tomato (Abhinav)</option>
                  <option value="South Valley (Cotton)">South Valley — Cotton (Bt)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#1F3027] mb-1">
                  Growth Stage
                </label>
                <input
                  type="text"
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E0E6DC] text-xs text-[#1F3027] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1F3027] mb-1">
                Optional Symptom Description
              </label>
              <textarea
                rows={2}
                value={symptomNotes}
                onChange={(e) => setSymptomNotes(e.target.value)}
                placeholder="Describe visible spots, wilting, discoloration, or leaf curling..."
                className="w-full px-3 py-2 rounded-xl border border-[#E0E6DC] text-xs text-[#1F3027] outline-none resize-none"
              />
            </div>

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
                  Analyzing Symptoms...
                </span>
              ) : (
                'Analyze My Crop'
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
                Evaluating visual evidence against verified agricultural pathogen references.
              </p>

              <div className="space-y-3 pt-2">
                <div className={`flex items-center gap-3 p-2.5 rounded-xl ${analysisStep >= 1 ? 'bg-[#E9F1E6] text-[#123D2D]' : 'text-[#66756A]'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${analysisStep >= 1 ? 'text-[#287A4B]' : 'text-[#66756A]/40'}`} />
                  <span className="font-semibold">Checking image clarity & leaf focus</span>
                </div>
                <div className={`flex items-center gap-3 p-2.5 rounded-xl ${analysisStep >= 2 ? 'bg-[#E9F1E6] text-[#123D2D]' : 'text-[#66756A]'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${analysisStep >= 2 ? 'text-[#287A4B]' : 'text-[#66756A]/40'}`} />
                  <span className="font-semibold">Analyzing visible lesion patterns & discoloration</span>
                </div>
                <div className={`flex items-center gap-3 p-2.5 rounded-xl ${analysisStep >= 3 ? 'bg-[#E9F1E6] text-[#123D2D]' : 'text-[#66756A]'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${analysisStep >= 3 ? 'text-[#287A4B]' : 'text-[#66756A]/40'}`} />
                  <span className="font-semibold">Preparing candidate diagnostic findings</span>
                </div>
              </div>
            </div>
          )}

          {/* Results Panel */}
          {diagnosisResult && !isAnalyzing ? (
            <div className="bg-white p-6 rounded-3xl border border-[#E0E6DC] shadow-xs space-y-5 text-xs animate-in fade-in">
              {/* Result Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E0E6DC]">
                <span className="font-bold text-xs uppercase tracking-wider text-[#66756A]">
                  Diagnostic Result
                </span>
                <Badge variant="warning" dot className="font-bold">
                  {Math.round(diagnosisResult.confidence * 100)}% Confidence
                </Badge>
              </div>

              {/* Identified Disease */}
              <div>
                <span className="text-[11px] font-semibold text-[#66756A] block">
                  Primary Candidate Diagnosis
                </span>
                <h3 className="text-xl font-extrabold text-[#123D2D] mt-0.5">
                  {diagnosisResult.diseaseName}
                </h3>
                <span className="text-xs text-[#287A4B] italic block">
                  {diagnosisResult.scientificName}
                </span>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-[#F8F7EF] border border-[#E0E6DC] text-[#1F3027] font-semibold">
                  {diagnosisResult.cropType} • {diagnosisResult.plantPart}
                </span>
              </div>

              {/* Observed Symptoms */}
              <div className="space-y-1.5 pt-1">
                <span className="font-bold text-[#1F3027] block">
                  Observed Visual Symptoms:
                </span>
                <ul className="space-y-1 text-[#66756A] pl-1">
                  {diagnosisResult.visibleSymptoms.map((symptom, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#287A4B] font-bold mt-0.5">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Alternative Possibilities */}
              <div className="p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC] space-y-1.5">
                <span className="font-bold text-[#123D2D] block">
                  Differential / Alternative Candidates:
                </span>
                {diagnosisResult.alternatives.map((alt, i) => (
                  <div key={i} className="flex items-center justify-between text-[#66756A]">
                    <span>{alt.name}</span>
                    <span className="font-semibold">{Math.round(alt.probability * 100)}%</span>
                  </div>
                ))}
              </div>

              {/* Scientific Honesty Disclaimer */}
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Important Scientific Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Image-based diagnostics cannot guarantee 100% certainty. Environmental conditions dictate whether fungal pathogens multiply. Always inspect physically before applying any intervention.
                </p>
              </div>

              {/* Recommended Next Step */}
              <div className="p-3.5 rounded-2xl bg-[#E9F1E6] border border-[#287A4B]/20 text-[#123D2D] space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#287A4B]" />
                  Recommended Next Step:
                </span>
                <p className="text-[#1F3027] text-xs leading-relaxed">
                  {diagnosisResult.recommendedNextStep}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-[#E0E6DC]">
                <Button
                  onClick={onCheckWeatherRisk}
                  className="w-full bg-[#347CB4] hover:bg-[#287A4B] text-white font-extrabold text-xs py-3 rounded-xl shadow-xs"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Check Weather Risk For This Disease
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsSaved(true)}
                  disabled={isSaved}
                  className="w-full rounded-xl text-xs font-bold border-[#E0E6DC] text-[#123D2D]"
                  leftIcon={<Bookmark className="w-3.5 h-3.5 text-[#287A4B]" />}
                >
                  {isSaved ? 'Diagnosis Saved to Field History' : 'Save Diagnosis'}
                </Button>
              </div>
            </div>
          ) : !isAnalyzing ? (
            /* Idle Reassurance Card */
            <div className="bg-white p-6 rounded-3xl border border-[#E0E6DC] shadow-2xs space-y-4 text-xs text-[#66756A]">
              <div className="w-10 h-10 rounded-2xl bg-[#E9F1E6] flex items-center justify-center text-[#287A4B]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-[#123D2D]">
                How BhoomiSparsh Diagnoses
              </h3>
              <p className="leading-relaxed">
                Our vision model analyzes discoloration, spot geometry, and chlorotic halos against agricultural pest & pathogen reference databases.
              </p>
              <div className="space-y-2 pt-2 border-t border-[#E0E6DC] text-[11px]">
                <p className="flex items-center gap-1.5 text-[#1F3027] font-semibold">
                  <Leaf className="w-3.5 h-3.5 text-[#287A4B]" />
                  Step 1: Check Leaf or Plant Photograph
                </p>
                <p className="flex items-center gap-1.5 text-[#1F3027] font-semibold">
                  <CloudSun className="w-3.5 h-3.5 text-[#347CB4]" />
                  Step 2: Compare with 72h Weather Moisture Risk
                </p>
                <p className="flex items-center gap-1.5 text-[#1F3027] font-semibold">
                  <Info className="w-3.5 h-3.5 text-[#E5A52C]" />
                  Step 3: Receive Safe Non-Chemical Guidance
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default CheckMyCropView
