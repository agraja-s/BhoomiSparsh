import React, { useState } from 'react'
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  Eye,
  Leaf,
  BookOpen,
  PhoneCall,
  Check,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import type { Language } from '../../utils/translations'

export interface AdvisoryCenterViewProps {
  language: Language
  onBackToDashboard: () => void
  onCheckCrop: () => void
}

export type ActionCategory =
  | 'Inspect'
  | 'Monitor'
  | 'Seek expert review'
  | 'Consider an appropriate intervention'
  | 'Reassess after updated conditions'

export interface AdvisoryItem {
  id: string
  title: string
  crop: string
  field: string
  disease: string
  riskCategory: 'High' | 'Elevated' | 'Moderate' | 'Low'
  forecastPeriod: string
  actionCategory: ActionCategory
  status: 'Needs inspection' | 'High priority' | 'Resolved'
  evidenceSummary: string
  suggestedAction: string
  lastUpdated: string
  whatWasObserved: string
  whyModelIdentifiedRisk: string
  whatRemainsUncertain: string
  whatToInspect: string[]
  whenToCheckAgain: string
  localGuidance: string
  whenToConsultExpert: string
}

const SAMPLE_ADVISORIES: AdvisoryItem[] = [
  {
    id: 'adv-1',
    title: 'Potato Late Blight: Canopy Moisture Caution Ahead of Rain',
    crop: 'Potato (Kufri Jyoti)',
    field: 'North Plot',
    disease: 'Late Blight (Phytophthora infestans)',
    riskCategory: 'Elevated',
    forecastPeriod: 'Next 48 Hours (Oct 11 – Oct 13)',
    actionCategory: 'Inspect',
    status: 'High priority',
    evidenceSummary: 'Symptom scan showed 2 leaf spots; nighttime relative humidity >90% forecasted with 6.5h leaf wetness.',
    suggestedAction: 'Physically examine lower canopy leaves. Remove infected tissue and cease overhead irrigation.',
    lastUpdated: 'Today 08:45 AM',
    whatWasObserved: 'Initial diagnostic scan detected water-soaked lesions with chlorotic haloes on 2 lower foliage samples.',
    whyModelIdentifiedRisk: 'Continuous leaf surface wetness >6 hours combined with canopy temperatures of 19–21°C trigger sporangial germination in Phytophthora infestans.',
    whatRemainsUncertain: 'Whether lesions have sporulated into adjacent furrows or if daytime wind will dry foliage fast enough.',
    whatToInspect: [
      'Check lower and inner canopy leaves where dew collects longest.',
      'Look for white downy fungal growth on the underside of discolored leaves early in the morning.',
      'Check stems for brown or black water-soaked stripes.',
    ],
    whenToCheckAgain: 'Tomorrow morning (within 24 hours) after morning dew evaporates.',
    localGuidance: 'ICAR-CPRI Pune recommends wide row spacing, sanitation pruning of infected foliage, and switching to drip irrigation to prevent spore splash.',
    whenToConsultExpert: 'If water-soaked lesions appear on >5% of plants across the plot or black lesions encircle main stems, contact KVK Baramati extension officer for bio-fungicide validation.',
  },
  {
    id: 'adv-2',
    title: 'Tomato Early Blight Monitoring: Moderate Humidity',
    crop: 'Tomato (Abhinav)',
    field: 'East Terrace',
    disease: 'Early Blight (Alternaria solani)',
    riskCategory: 'Moderate',
    forecastPeriod: 'Next 72 Hours',
    actionCategory: 'Monitor',
    status: 'Needs inspection',
    evidenceSummary: 'Warm afternoon temperatures (27°C) with moderate humidity. No active lesions confirmed on current leaves.',
    suggestedAction: 'Maintain clean mulching around root zones and monitor lower foliage twice weekly.',
    lastUpdated: 'Yesterday 05:30 PM',
    whatWasObserved: 'Foliage appears vigorous and dark green; no concentric circular leaf spots detected.',
    whyModelIdentifiedRisk: 'Alternaria sporulation is favored when temperatures rise to 26–30°C following rain showers.',
    whatRemainsUncertain: 'Micro-climate variation in terrace corners with poorer air drainage.',
    whatToInspect: [
      'Inspect oldest bottom leaves for concentric target-like rings.',
      'Inspect stem branches near soil splash zone.',
    ],
    whenToCheckAgain: 'In 3 days during regular weeding.',
    localGuidance: 'Apply organic neem kernel extract (5%) as preventive canopy barrier if heavy showers continue.',
    whenToConsultExpert: 'If lower foliage exhibits extensive yellowing or leaf drop.',
  },
  {
    id: 'adv-3',
    title: 'Cotton Sucking Pest & Boll Health Routine Clear',
    crop: 'Cotton (Bt)',
    field: 'South Valley',
    disease: 'Leaf Curl & Boll Rot',
    riskCategory: 'Low',
    forecastPeriod: 'Next 7 Days',
    actionCategory: 'Monitor',
    status: 'Resolved',
    evidenceSummary: 'Dry sunny conditions forecasted; low leaf wetness risk and healthy square formation.',
    suggestedAction: 'Standard routine scouting; no special protective intervention needed.',
    lastUpdated: '2 days ago',
    whatWasObserved: 'Clean foliage, active beneficial insect presence (ladybird beetles).',
    whyModelIdentifiedRisk: 'Low fungal risk due to ambient daytime humidity <65%.',
    whatRemainsUncertain: 'None currently.',
    whatToInspect: ['Check underleaf surface for whitefly or aphid presence.'],
    whenToCheckAgain: 'Weekly field walk.',
    localGuidance: 'Maintain yellow sticky traps along field perimeter.',
    whenToConsultExpert: 'If whitefly counts exceed economic threshold levels (6–8 per leaf).',
  },
]

export const AdvisoryCenterView: React.FC<AdvisoryCenterViewProps> = ({
  language: _language,
  onBackToDashboard,
  onCheckCrop,
}) => {
  const [filter, setFilter] = useState<'All' | 'High priority' | 'Needs inspection' | 'Resolved'>('All')
  const [selectedAdvisory, setSelectedAdvisory] = useState<AdvisoryItem | null>(SAMPLE_ADVISORIES[0])

  const filteredAdvisories =
    filter === 'All'
      ? SAMPLE_ADVISORIES
      : SAMPLE_ADVISORIES.filter((a) => a.status === filter)

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* Header & Navigation */}
      <div className="pb-4 border-b border-[#E0E6DC] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#287A4B] uppercase tracking-wider block mb-1">
            Agricultural Guidance Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2D] tracking-tight">
            Your farming guidance
          </h1>
          <p className="text-sm text-[#66756A] mt-1">
            Clear next steps based on crop observations and environmental conditions.
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={onCheckCrop}
          className="bg-[#123D2D] hover:bg-[#287A4B] text-white rounded-xl text-xs font-bold shadow-xs self-start md:self-auto"
        >
          Check Another Crop Photo
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {(['All', 'High priority', 'Needs inspection', 'Resolved'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              filter === tab
                ? 'bg-[#123D2D] text-white shadow-xs'
                : 'bg-white text-[#66756A] border border-[#E0E6DC] hover:text-[#123D2D]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Grid: Advisory Cards & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Advisory Cards List */}
        <div className="lg:col-span-5 space-y-4">
          {filteredAdvisories.map((advisory) => (
            <div
              key={advisory.id}
              onClick={() => setSelectedAdvisory(advisory)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white text-xs ${
                selectedAdvisory?.id === advisory.id
                  ? 'border-[#287A4B] ring-2 ring-[#287A4B]/20 shadow-sm'
                  : 'border-[#E0E6DC] hover:border-[#6BA66B] shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E0E6DC]">
                <span className="font-bold text-[#123D2D]">
                  {advisory.crop} • {advisory.field}
                </span>
                <Badge
                  variant={
                    advisory.riskCategory === 'Elevated' || advisory.riskCategory === 'High'
                      ? 'warning'
                      : 'success'
                  }
                  className="text-[10px]"
                >
                  {advisory.riskCategory} Risk
                </Badge>
              </div>

              <div className="mt-3 space-y-1.5">
                <h3 className="font-extrabold text-sm text-[#123D2D] leading-snug">
                  {advisory.title}
                </h3>
                <p className="text-[#66756A] line-clamp-2 leading-relaxed">
                  {advisory.suggestedAction}
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-[#E0E6DC] flex items-center justify-between text-[11px] text-[#66756A]">
                <span className="px-2 py-0.5 rounded-md bg-[#F8F7EF] font-bold text-[#1F3027]">
                  Action: {advisory.actionCategory}
                </span>
                <span className="font-bold text-[#287A4B] flex items-center gap-1">
                  Read Details <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Full Advisory Detail Panel */}
        <div className="lg:col-span-7">
          {selectedAdvisory ? (
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E0E6DC] shadow-xs space-y-5 text-xs text-[#1F3027]">
              {/* Detail Header */}
              <div className="pb-4 border-b border-[#E0E6DC] space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#E9F1E6] text-[#123D2D] font-bold text-xs flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-[#287A4B]" />
                    {selectedAdvisory.field} ({selectedAdvisory.crop})
                  </span>
                  <span className="text-[#66756A] text-[11px]">
                    Last Updated: {selectedAdvisory.lastUpdated}
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-[#123D2D] leading-snug">
                  {selectedAdvisory.title}
                </h2>
                <p className="text-xs text-[#66756A]">
                  Forecast Window: <strong className="text-[#1F3027]">{selectedAdvisory.forecastPeriod}</strong> • Target Pathogen: <strong className="text-[#1F3027]">{selectedAdvisory.disease}</strong>
                </p>
              </div>

              {/* What Was Observed */}
              <div className="space-y-1">
                <span className="font-extrabold text-[#123D2D] text-xs block">
                  1. What Was Observed:
                </span>
                <p className="text-[#66756A] leading-relaxed">
                  {selectedAdvisory.whatWasObserved}
                </p>
              </div>

              {/* Why the Model Identified Risk */}
              <div className="space-y-1">
                <span className="font-extrabold text-[#123D2D] text-xs block">
                  2. Why Model Identified Potential Risk:
                </span>
                <p className="text-[#66756A] leading-relaxed">
                  {selectedAdvisory.whyModelIdentifiedRisk}
                </p>
              </div>

              {/* What to Inspect in the Field */}
              <div className="p-4 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC] space-y-2">
                <span className="font-extrabold text-[#123D2D] text-xs flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#287A4B]" />
                  3. What to Inspect in the Field:
                </span>
                <ul className="space-y-1 text-[#1F3027] pl-1">
                  {selectedAdvisory.whatToInspect.map((step, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#287A4B] shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* When to Check Again */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-900">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>When to Check Again:</strong> {selectedAdvisory.whenToCheckAgain}
                </span>
              </div>

              {/* Local Agricultural Extension Guidance */}
              <div className="space-y-1.5 pt-1">
                <span className="font-extrabold text-[#123D2D] text-xs flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#287A4B]" />
                  4. Local Agricultural Guidance (ICAR & KVK Pune):
                </span>
                <p className="text-[#66756A] leading-relaxed">
                  {selectedAdvisory.localGuidance}
                </p>
              </div>

              {/* Mandatory Safety & Non-Chemical Notice */}
              <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#E5A52C]/60 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#9A6A12] font-bold">
                  <AlertTriangle className="w-4 h-4 text-[#E5A52C]" />
                  <span>Important Safety & Spray Regulation Rule:</span>
                </div>
                <p className="text-[#725039] leading-relaxed text-[11px]">
                  <strong>A weather risk alert must never automatically become a chemical spray instruction.</strong> Chemical intervention should only follow physical field confirmation and adhere strictly to CIBRC approved label dosages with full personal protective equipment.
                </p>
              </div>

              {/* When to Consult Expert Banner */}
              <div className="pt-2 border-t border-[#E0E6DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#123D2D] font-bold">
                  <PhoneCall className="w-4 h-4 text-[#287A4B]" />
                  <span>KVK Helpline: 1800-180-1551 (Kisan Call Center)</span>
                </div>

                <Button
                  size="sm"
                  onClick={onBackToDashboard}
                  className="bg-[#123D2D] text-white rounded-xl text-xs font-bold"
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#E0E6DC] text-[#66756A] text-xs">
              Select an advisory card to view detailed cultural guidelines.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdvisoryCenterView
