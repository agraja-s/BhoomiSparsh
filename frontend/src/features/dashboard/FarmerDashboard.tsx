import React, { useState } from 'react'
import {
  Camera,
  CloudSun,
  Droplets,
  Thermometer,
  CloudRain,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  ChevronDown,
  MapPin,
  ShieldAlert,
  Layers,
  RefreshCw,
  X,
  Leaf,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import type { Language } from '../../utils/translations'
import type { AssessmentResponse } from '../../types/assessment'

export interface FieldItem {
  id: string
  name: string
  crop: string
  variety: string
  area: string
  growthStage: string
  sowingDate: string
  lastInspection: string
  healthStatus: 'Attention Needed' | 'Healthy' | 'Moderate Risk'
  healthDetails: string
  riskCategory: 'Elevated' | 'Low' | 'Moderate' | 'High'
  image: string
}

const INITIAL_FIELDS: FieldItem[] = [
  {
    id: 'field-1',
    name: 'North Plot',
    crop: 'Potato',
    variety: 'Kufri Jyoti',
    area: '0.8 Hectares',
    growthStage: 'Tuber Initiation (Day 42)',
    sowingDate: 'Aug 30, 2026',
    lastInspection: 'Today 08:30 AM',
    healthStatus: 'Attention Needed',
    healthDetails: 'Water-soaked spots observed on 2 sample leaves in lower canopy',
    riskCategory: 'Elevated',
    image: '/potato_crop.jpg',
  },
  {
    id: 'field-2',
    name: 'East Terrace',
    crop: 'Tomato',
    variety: 'Abhinav Hybrid',
    area: '0.5 Hectares',
    growthStage: 'Early Flowering (Day 35)',
    sowingDate: 'Sep 06, 2026',
    lastInspection: 'Yesterday 05:15 PM',
    healthStatus: 'Healthy',
    healthDetails: 'Vigorous leaf growth, no fungal or bacterial lesions noted',
    riskCategory: 'Low',
    image: '/potato_crop.jpg',
  },
  {
    id: 'field-3',
    name: 'South Valley',
    crop: 'Cotton',
    variety: 'Bt Cotton RCH-2',
    area: '1.2 Hectares',
    growthStage: 'Vegetative Canopy (Day 28)',
    sowingDate: 'Sep 13, 2026',
    lastInspection: '3 days ago',
    healthStatus: 'Healthy',
    healthDetails: 'Uniform foliage growth, stem girth normal',
    riskCategory: 'Low',
    image: '/potato_crop.jpg',
  },
]

export interface FarmerDashboardProps {
  language: Language
  onStartNewAssessment: () => void
  onSelectAssessment: (assessment: AssessmentResponse) => void
  recentAssessments: AssessmentResponse[]
  isMockMode: boolean
  onNavigateWeatherRisk?: () => void
  onNavigateAdvisories?: () => void
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  language,
  onStartNewAssessment,
  onSelectAssessment,
  recentAssessments,
  isMockMode,
  onNavigateWeatherRisk,
  onNavigateAdvisories,
}) => {
  const [fields, setFields] = useState<FieldItem[]>(INITIAL_FIELDS)
  const [selectedFieldId, setSelectedFieldId] = useState<string>('field-1')
  const [isFieldDropdownOpen, setIsFieldDropdownOpen] = useState(false)
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false)
  const [isRefreshingWeather, setIsRefreshingWeather] = useState(false)

  // New field form state
  const [newFieldName, setNewFieldName] = useState('')
  const [newFieldCrop, setNewFieldCrop] = useState('Potato')
  const [newFieldVariety, setNewFieldVariety] = useState('')
  const [newFieldArea, setNewFieldArea] = useState('')

  const activeField = fields.find((f) => f.id === selectedFieldId) || fields[0]

  const handleAddFieldSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFieldName.trim()) return

    const newField: FieldItem = {
      id: `field-${Date.now()}`,
      name: newFieldName,
      crop: newFieldCrop,
      variety: newFieldVariety || 'Local High-Yield',
      area: newFieldArea ? `${newFieldArea} Ha` : '0.5 Hectares',
      growthStage: 'Early Vegetative (Day 14)',
      sowingDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastInspection: 'Just now',
      healthStatus: 'Healthy',
      healthDetails: 'Initial baseline created',
      riskCategory: 'Low',
      image: '/potato_crop.jpg',
    }

    setFields([...fields, newField])
    setSelectedFieldId(newField.id)
    setIsAddFieldModalOpen(false)
    setNewFieldName('')
    setNewFieldVariety('')
    setNewFieldArea('')
  }

  const handleSimulateRefresh = () => {
    setIsRefreshingWeather(true)
    setTimeout(() => {
      setIsRefreshingWeather(false)
    }, 800)
  }

  return (
    <div className="space-y-8 text-left">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. WELCOME GREETING & LOCATION HEADER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#E0E6DC]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F1E6] text-[#123D2D] text-xs font-bold mb-2">
            <Leaf className="w-3.5 h-3.5 text-[#287A4B]" />
            <span>KVK Baramati Region • Kharif & Rabi Season</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2D] tracking-tight">
            {language === 'mr'
              ? 'शुभ सकाळ, रमेश! आपल्या पिकांना निरोगी ठेवूया.'
              : language === 'hi'
              ? 'शुभ प्रभात, रमेश! आइए अपनी फसलों को स्वस्थ रखें.'
              : "Good morning, Ramesh! Let's keep your crops healthy."}
          </h1>
          <p className="text-sm text-[#66756A] mt-1">
            {language === 'mr'
              ? 'आज आपल्या शेताबद्दल आपल्याला काय माहित असणे आवश्यक आहे ते येथे आहे.'
              : language === 'hi'
              ? 'आज आपके खेत के बारे में आपको क्या जानने की आवश्यकता है, वह यहाँ है.'
              : "Here's what you need to know about your farm today."}
          </p>
        </div>

        {/* Data Status & Last Synced */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSimulateRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E0E6DC] bg-white text-xs font-semibold text-[#1F3027] hover:bg-[#F8F7EF] transition-colors cursor-pointer"
            title="Refresh weather and sensor observations"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#287A4B] ${isRefreshingWeather ? 'animate-spin' : ''}`} />
            <span>Updated 15m ago</span>
          </button>

          {isMockMode && (
            <Badge variant="mock" dot className="px-2.5 py-1 text-[11px] font-bold">
              DEMO DATA
            </Badge>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. FARM & FIELD SELECTOR BAR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E0E6DC] p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Active Field Overview */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E9F1E6] flex items-center justify-center text-[#287A4B] shrink-0">
              <Layers className="w-6 h-6 text-[#287A4B]" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#66756A] uppercase tracking-wider">
                  Active Field Context
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#287A4B]" />
                <span className="text-xs font-semibold text-[#123D2D]">
                  Green Valley Farm
                </span>
              </div>

              <div className="flex items-center gap-3 mt-0.5">
                <h2 className="text-lg font-extrabold text-[#123D2D]">
                  {activeField.name} — {activeField.crop} ({activeField.variety})
                </h2>
              </div>

              <p className="text-xs text-[#66756A] mt-0.5 flex items-center gap-2">
                <span>Growth Stage: <strong className="text-[#1F3027]">{activeField.growthStage}</strong></span>
                <span>•</span>
                <span>Area: <strong className="text-[#1F3027]">{activeField.area}</strong></span>
                <span>•</span>
                <span>Sown: <strong className="text-[#1F3027]">{activeField.sowingDate}</strong></span>
              </p>
            </div>
          </div>

          {/* Switch Field Dropdown & Add Field Action */}
          <div className="flex items-center gap-2 self-start lg:self-center relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFieldDropdownOpen(!isFieldDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E0E6DC] bg-[#F8F7EF] hover:bg-white text-xs font-bold text-[#123D2D] transition-colors cursor-pointer"
              >
                <span>Switch Field ({activeField.name})</span>
                <ChevronDown className="w-4 h-4 text-[#66756A]" />
              </button>

              {isFieldDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E0E6DC] p-2 z-40">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-[#66756A] uppercase">
                    Select Farm Plot
                  </div>
                  {fields.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setSelectedFieldId(f.id)
                        setIsFieldDropdownOpen(false)
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        f.id === selectedFieldId
                          ? 'bg-[#E9F1E6] text-[#123D2D] font-bold'
                          : 'hover:bg-[#F8F7EF] text-[#1F3027]'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{f.name}</div>
                        <div className="text-[11px] text-[#66756A]">
                          {f.crop} • {f.area}
                        </div>
                      </div>
                      <Badge
                        variant={f.riskCategory === 'Elevated' ? 'warning' : 'success'}
                        className="text-[10px] py-0 px-2"
                      >
                        {f.riskCategory} Risk
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddFieldModalOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5 text-[#287A4B]" />}
              className="text-xs font-bold text-[#123D2D] border-[#E0E6DC] hover:border-[#287A4B] rounded-xl"
            >
              Add Field
            </Button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. KEY STATUS CARDS (THREE COMPACT, HONEST CARDS) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Crop Health */}
        <div className="p-5 rounded-2xl bg-white border border-[#E0E6DC] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0E6DC]/60">
            <span className="text-xs font-bold text-[#66756A] uppercase tracking-wider">
              Crop Health
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E5A52C]/15 text-[#9A6A12] border border-[#E5A52C]/30">
              <AlertTriangle className="w-3 h-3 text-[#E5A52C]" />
              Attention Needed
            </span>
          </div>
          <div className="mt-3.5 space-y-2">
            <p className="text-sm font-bold text-[#1F3027] leading-snug">
              Early leaf spots observed on 2 sample plants in lower canopy.
            </p>
            <p className="text-xs text-[#66756A] leading-relaxed">
              Diagnostic findings indicate early fungal sporulation symptoms resembling Late Blight.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E0E6DC]/60 flex items-center justify-between text-xs">
            <span className="text-[#66756A]">Last check: Today 08:30 AM</span>
            <button
              type="button"
              onClick={onStartNewAssessment}
              className="font-bold text-[#287A4B] hover:text-[#123D2D] flex items-center gap-1 cursor-pointer"
            >
              <span>Scan Again</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Weather Risk */}
        <div className="p-5 rounded-2xl bg-white border border-[#E0E6DC] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0E6DC]/60">
            <span className="text-xs font-bold text-[#66756A] uppercase tracking-wider">
              Weather Risk
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-[#9A6A12] border border-amber-300">
              <CloudSun className="w-3 h-3 text-[#E5A52C]" />
              Elevated Risk
            </span>
          </div>
          <div className="mt-3.5 space-y-2">
            <p className="text-sm font-bold text-[#1F3027] leading-snug">
              High relative humidity &gt;88% and mild canopy temps next 48h.
            </p>
            <p className="text-xs text-[#66756A] leading-relaxed">
              Prolonged free moisture on leaves creates favorable conditions for rapid spore multiplication.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E0E6DC]/60 flex items-center justify-between text-xs">
            <span className="text-[#66756A]">Horizon: 72 Hours</span>
            <button
              type="button"
              onClick={() => {
                if (recentAssessments.length > 0) {
                  onSelectAssessment(recentAssessments[0])
                }
              }}
              className="font-bold text-[#347CB4] hover:text-[#123D2D] flex items-center gap-1 cursor-pointer"
            >
              <span>View Curve</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Pending Advisories */}
        <div className="p-5 rounded-2xl bg-white border border-[#E0E6DC] shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0E6DC]/60">
            <span className="text-xs font-bold text-[#66756A] uppercase tracking-wider">
              Pending Advisories
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E9F1E6] text-[#123D2D] border border-[#287A4B]/30">
              <ShieldAlert className="w-3 h-3 text-[#287A4B]" />
              1 Recommended
            </span>
          </div>
          <div className="mt-3.5 space-y-2">
            <p className="text-sm font-bold text-[#1F3027] leading-snug">
              Physical canopy inspection scheduled before evening dew.
            </p>
            <p className="text-xs text-[#66756A] leading-relaxed">
              No chemical spray advised. Prune discolored lower leaves and halt overhead sprinkler irrigation.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E0E6DC]/60 flex items-center justify-between text-xs">
            <span className="text-[#66756A]">Action Window: 16 Hours</span>
            <button
              type="button"
              onClick={() => {
                if (recentAssessments.length > 0) {
                  onSelectAssessment(recentAssessments[0])
                }
              }}
              className="font-bold text-[#287A4B] hover:text-[#123D2D] flex items-center gap-1 cursor-pointer"
            >
              <span>Full Guidance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. PRIORITY ADVISORY (ACTIONABLE HERO ALERT WITH DEMO TAG) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-linear-to-br from-[#FFFDF5] to-[#FBF7E8] border border-[#E5A52C]/40 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#E5A52C] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-2xs">
                <AlertTriangle className="w-3.5 h-3.5 text-white" />
                PRIORITY ACTION REQUIRED
              </span>
              <span className="text-xs font-bold text-[#725039] bg-[#725039]/10 px-2.5 py-0.5 rounded-md">
                DEMO DATA
              </span>
              <span className="text-xs text-[#66756A]">
                Field: <strong>{activeField.name} ({activeField.crop})</strong> • Forecast Window: <strong>Next 48 Hours</strong>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[#123D2D] tracking-tight leading-snug">
              Weather may become favorable for potato late blight over the next 48 hours.
            </h3>

            {/* Environmental Drivers List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-[#1F3027]">
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/80 border border-[#E0E6DC]">
                <Droplets className="w-4 h-4 text-[#347CB4] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Relative Humidity &gt; 90%</strong>
                  <span className="text-[#66756A]">Prolonged night-time dew creates persistent leaf moisture film.</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/80 border border-[#E0E6DC]">
                <Thermometer className="w-4 h-4 text-[#E5A52C] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Canopy Temp 18°C – 22°C</strong>
                  <span className="text-[#66756A]">Optimal thermal band for Phytophthora sporangia germination.</span>
                </div>
              </div>
            </div>

            {/* Suggested Next Step & Confidence */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 text-[#123D2D] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#287A4B]" />
                <span>Suggested Next Step: Inspect lower leaves and cease overhead irrigation today.</span>
              </div>
              <span className="hidden sm:inline text-[#66756A]">•</span>
              <span className="text-[#66756A] text-[11px]">
                Model Confidence: <strong>Moderate (88%)</strong> based on 12-hour sensor feed.
              </span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="shrink-0 flex flex-col gap-2">
            <Button
              size="lg"
              onClick={() => {
                if (recentAssessments.length > 0) {
                  onSelectAssessment(recentAssessments[0])
                }
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-[#123D2D] hover:bg-[#287A4B] text-white font-extrabold px-6 py-4 rounded-2xl shadow-sm text-sm"
            >
              View Full Advisory
            </Button>
            <span className="text-[10px] text-center text-[#66756A]">
              Non-chemical cultural guidance
            </span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. WEATHER SNAPSHOT PANEL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E0E6DC] shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E0E6DC] gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#347CB4]/15 flex items-center justify-center text-[#347CB4]">
              <CloudSun className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#123D2D] text-base">
                Local Weather Observations & Micro-Climate Snapshot
              </h3>
              <p className="text-xs text-[#66756A]">
                Station: Pune District (18.52° N, 73.85° E) • Open-Meteo Integration
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (recentAssessments.length > 0) {
                onSelectAssessment(recentAssessments[0])
              }
            }}
            className="text-xs font-bold text-[#347CB4] hover:text-[#123D2D] flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View 7-Day Forecast & Pathogen Risk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC]">
            <div className="flex items-center justify-between text-[#66756A] text-xs font-semibold">
              <span>Temperature</span>
              <Thermometer className="w-4 h-4 text-[#E5A52C]" />
            </div>
            <div className="text-2xl font-black text-[#123D2D] mt-2">
              22.4°C
            </div>
            <div className="text-[11px] text-[#66756A] mt-1">
              Min 18.2°C • Max 27.1°C
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC]">
            <div className="flex items-center justify-between text-[#66756A] text-xs font-semibold">
              <span>Relative Humidity</span>
              <Droplets className="w-4 h-4 text-[#347CB4]" />
            </div>
            <div className="text-2xl font-black text-[#347CB4] mt-2">
              91%
            </div>
            <div className="text-[11px] text-[#C74C43] font-bold mt-1">
              Elevated Spore Transmission
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC]">
            <div className="flex items-center justify-between text-[#66756A] text-xs font-semibold">
              <span>Rainfall Probability</span>
              <CloudRain className="w-4 h-4 text-[#347CB4]" />
            </div>
            <div className="text-2xl font-black text-[#123D2D] mt-2">
              65%
            </div>
            <div className="text-[11px] text-[#66756A] mt-1">
              1.8 mm light rain in 18 hrs
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC]">
            <div className="flex items-center justify-between text-[#66756A] text-xs font-semibold">
              <span>Leaf Wetness Duration</span>
              <Leaf className="w-4 h-4 text-[#287A4B]" />
            </div>
            <div className="text-2xl font-black text-[#287A4B] mt-2">
              6.5 hrs
            </div>
            <div className="text-[11px] text-[#66756A] mt-1">
              Estimated nocturnal condensation
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. MY CROPS (MULTI-FIELD CARDS WITH REAL IMAGES & STATUS) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-[#123D2D] tracking-tight">
              My Crops & Monitored Fields
            </h3>
            <p className="text-xs text-[#66756A]">
              Real-time health status and micro-climatic assessments across all plots
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddFieldModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5 text-[#287A4B]" />}
            className="rounded-xl text-xs font-bold"
          >
            Add New Plot
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {fields.map((field) => (
            <div
              key={field.id}
              className={`rounded-2xl border transition-all overflow-hidden bg-white ${
                field.id === selectedFieldId
                  ? 'border-[#287A4B] ring-2 ring-[#287A4B]/20 shadow-md'
                  : 'border-[#E0E6DC] hover:border-[#6BA66B] shadow-2xs'
              }`}
            >
              {/* Card Photo Header */}
              <div className="h-40 w-full relative overflow-hidden bg-[#E9F1E6]">
                <img
                  src={field.image}
                  alt={field.crop}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-xs font-bold">
                    {field.crop} • {field.variety}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge
                    variant={field.riskCategory === 'Elevated' ? 'warning' : 'success'}
                    dot
                    className="shadow-xs"
                  >
                    {field.riskCategory} Risk
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 text-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-[#123D2D]">
                      {field.name}
                    </h4>
                    <span className="text-[#66756A] text-[11px] font-medium">
                      {field.area}
                    </span>
                  </div>
                  <p className="text-[#66756A] text-[11px] mt-0.5">
                    Growth Stage: <span className="text-[#1F3027] font-semibold">{field.growthStage}</span>
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F8F7EF] border border-[#E0E6DC] space-y-1">
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span className="text-[#123D2D]">Latest Assessment:</span>
                    <span
                      className={
                        field.healthStatus === 'Attention Needed'
                          ? 'text-[#E5A52C]'
                          : 'text-[#287A4B]'
                      }
                    >
                      {field.healthStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#66756A] line-clamp-2 leading-relaxed">
                    {field.healthDetails}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#E0E6DC] text-[#66756A]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#66756A]" />
                    {field.lastInspection}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFieldId(field.id)
                      if (recentAssessments.length > 0) {
                        onSelectAssessment(recentAssessments[0])
                      }
                    }}
                    className="font-bold text-[#287A4B] hover:text-[#123D2D] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. QUICK ACTIONS (LARGE INTUITIVE BUTTONS) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-extrabold text-[#123D2D]">
          Quick Farm Actions
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Action 1: Scan a Crop */}
          <button
            type="button"
            onClick={onStartNewAssessment}
            className="p-5 rounded-2xl bg-white border border-[#E0E6DC] hover:border-[#287A4B] hover:bg-[#F8F7EF] transition-all text-left shadow-2xs group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#123D2D] text-white flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
              <Camera className="w-6 h-6 text-[#E9F1E6]" />
            </div>
            <div className="font-extrabold text-sm text-[#123D2D]">
              Scan a Crop
            </div>
            <p className="text-xs text-[#66756A] mt-1 leading-snug">
              Photograph leaf symptoms for rapid AI diagnosis.
            </p>
          </button>

          {/* Action 2: View Weather Risk */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateWeatherRisk) {
                onNavigateWeatherRisk()
              } else if (recentAssessments.length > 0) {
                onSelectAssessment(recentAssessments[0])
              }
            }}
            className="p-5 rounded-2xl bg-white border border-[#E0E6DC] hover:border-[#347CB4] hover:bg-[#F8F7EF] transition-all text-left shadow-2xs group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#347CB4] text-white flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
              <CloudSun className="w-6 h-6 text-white" />
            </div>
            <div className="font-extrabold text-sm text-[#123D2D]">
              View Weather Risk
            </div>
            <p className="text-xs text-[#66756A] mt-1 leading-snug">
              Micro-climatic pathogen risk curves for 72 hours.
            </p>
          </button>

          {/* Action 3: My Advisories */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateAdvisories) {
                onNavigateAdvisories()
              } else if (recentAssessments.length > 0) {
                onSelectAssessment(recentAssessments[0])
              }
            }}
            className="p-5 rounded-2xl bg-white border border-[#E0E6DC] hover:border-[#E5A52C] hover:bg-[#F8F7EF] transition-all text-left shadow-2xs group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E5A52C] text-white flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div className="font-extrabold text-sm text-[#123D2D]">
              My Advisories
            </div>
            <p className="text-xs text-[#66756A] mt-1 leading-snug">
              Review cultural, non-chemical farm guidelines.
            </p>
          </button>

          {/* Action 4: Add a Field */}
          <button
            type="button"
            onClick={() => setIsAddFieldModalOpen(true)}
            className="p-5 rounded-2xl bg-white border border-[#E0E6DC] hover:border-[#287A4B] hover:bg-[#F8F7EF] transition-all text-left shadow-2xs group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E9F1E6] text-[#287A4B] flex items-center justify-center group-hover:scale-105 transition-transform mb-3">
              <Plus className="w-6 h-6 text-[#287A4B]" />
            </div>
            <div className="font-extrabold text-sm text-[#123D2D]">
              Add a Field
            </div>
            <p className="text-xs text-[#66756A] mt-1 leading-snug">
              Register a new plot, crop variety, or soil type.
            </p>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 8. ADD FIELD MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isAddFieldModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E0E6DC] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0E6DC]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E9F1E6] flex items-center justify-center text-[#287A4B]">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-[#123D2D]">
                  Add New Farm Plot
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddFieldModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F8F7EF] flex items-center justify-center text-[#66756A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFieldSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#1F3027] mb-1">
                  Field / Plot Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. West Canal Plot"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E6DC] focus:border-[#287A4B] focus:ring-2 focus:ring-[#287A4B]/20 outline-none text-sm text-[#1F3027]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    Crop Type *
                  </label>
                  <select
                    value={newFieldCrop}
                    onChange={(e) => setNewFieldCrop(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E0E6DC] focus:border-[#287A4B] outline-none text-xs bg-white text-[#1F3027]"
                  >
                    <option value="Potato">Potato</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Rice">Rice</option>
                    <option value="Soybean">Soybean</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    Variety (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kufri Jyoti"
                    value={newFieldVariety}
                    onChange={(e) => setNewFieldVariety(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E0E6DC] focus:border-[#287A4B] outline-none text-xs text-[#1F3027]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    Approx Area (Hectares)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.8"
                    value={newFieldArea}
                    onChange={(e) => setNewFieldArea(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E0E6DC] focus:border-[#287A4B] outline-none text-xs text-[#1F3027]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    Location
                  </label>
                  <div className="px-3 py-2.5 rounded-xl bg-[#F8F7EF] border border-[#E0E6DC] text-xs text-[#66756A] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#287A4B]" />
                    <span>Pune District (Default)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E0E6DC] flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddFieldModalOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#123D2D] hover:bg-[#287A4B] text-white rounded-xl font-bold"
                >
                  Save Field Plot
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FarmerDashboard
