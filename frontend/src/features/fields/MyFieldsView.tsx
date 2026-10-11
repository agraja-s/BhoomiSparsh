import React, { useState } from 'react'
import {
  MapPin,
  Plus,
  Leaf,
  X,
  History,
  Camera,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import type { Language } from '../../utils/translations'

export interface MyFieldsViewProps {
  language: Language
  onStartCropCheck: () => void
  onViewWeatherRisk: () => void
}

export interface DetailedField {
  id: string
  name: string
  location: string
  coordinates: string
  crop: string
  variety: string
  sowingDate: string
  growthStage: string
  areaHa: number
  soilType: string
  lastCropCheck: string
  latestRisk: 'Elevated' | 'Low' | 'Moderate'
  observationsCount: number
  historyItems: { date: string; event: string; status: string }[]
}

const INITIAL_FIELDS_DETAILED: DetailedField[] = [
  {
    id: 'f-1',
    name: 'North Plot',
    location: 'Pune District, Maharashtra',
    coordinates: '18.5204° N, 73.8567° E',
    crop: 'Potato',
    variety: 'Kufri Jyoti',
    sowingDate: 'Aug 30, 2026',
    growthStage: 'Tuber Initiation (Day 42)',
    areaHa: 0.8,
    soilType: 'Medium Black Clay Loam',
    lastCropCheck: 'Today 08:30 AM',
    latestRisk: 'Elevated',
    observationsCount: 6,
    historyItems: [
      { date: 'Today 08:30 AM', event: 'Suspected Late Blight spots on lower canopy', status: 'Attention Needed' },
      { date: 'Oct 04, 2026', event: 'Vegetative growth inspection - clear', status: 'Healthy' },
      { date: 'Sep 21, 2026', event: 'First weed clearance & hilling up', status: 'Healthy' },
    ],
  },
  {
    id: 'f-2',
    name: 'East Terrace',
    location: 'Pune District, Maharashtra',
    coordinates: '18.5221° N, 73.8590° E',
    crop: 'Tomato',
    variety: 'Abhinav Hybrid',
    sowingDate: 'Sep 06, 2026',
    growthStage: 'Early Flowering (Day 35)',
    areaHa: 0.5,
    soilType: 'Well-Drained Red Sandy Loam',
    lastCropCheck: 'Yesterday 05:15 PM',
    latestRisk: 'Low',
    observationsCount: 4,
    historyItems: [
      { date: 'Yesterday 05:15 PM', event: 'Routine blossom inspection - vigorous foliage', status: 'Healthy' },
      { date: 'Sep 25, 2026', event: 'Bamboo staking & lower tying', status: 'Healthy' },
    ],
  },
  {
    id: 'f-3',
    name: 'South Valley',
    location: 'Pune District, Maharashtra',
    coordinates: '18.5170° N, 73.8540° E',
    crop: 'Cotton',
    variety: 'Bt Cotton RCH-2',
    sowingDate: 'Sep 13, 2026',
    growthStage: 'Canopy Vegetative (Day 28)',
    areaHa: 1.2,
    soilType: 'Deep Black Cotton Soil (Regur)',
    lastCropCheck: '3 days ago',
    latestRisk: 'Low',
    observationsCount: 3,
    historyItems: [
      { date: '3 days ago', event: 'Pest scouting - ladybird beetles observed, no sucking pests', status: 'Healthy' },
    ],
  },
]

export const MyFieldsView: React.FC<MyFieldsViewProps> = ({
  language: _language,
  onStartCropCheck,
  onViewWeatherRisk,
}) => {
  const [fieldsList, setFieldsList] = useState<DetailedField[]>(INITIAL_FIELDS_DETAILED)
  const [selectedField, setSelectedField] = useState<DetailedField>(INITIAL_FIELDS_DETAILED[0])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Form State
  const [fieldName, setFieldName] = useState('')
  const [cropType, setCropType] = useState('Potato')
  const [variety, setVariety] = useState('')
  const [area, setArea] = useState('0.6')
  const [sowingDate, setSowingDate] = useState('2026-09-15')

  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fieldName.trim()) return

    const newF: DetailedField = {
      id: `f-${Date.now()}`,
      name: fieldName,
      location: 'Pune District, Maharashtra',
      coordinates: '18.5190° N, 73.8550° E',
      crop: cropType,
      variety: variety || 'Local High-Yield',
      sowingDate,
      growthStage: 'Early Emergence (Day 10)',
      areaHa: parseFloat(area) || 0.5,
      soilType: 'Medium Black Loam',
      lastCropCheck: 'Just registered',
      latestRisk: 'Low',
      observationsCount: 1,
      historyItems: [
        { date: 'Just now', event: 'Field plot registered in BhoomiSparsh', status: 'Baseline' },
      ],
    }

    setFieldsList([...fieldsList, newF])
    setSelectedField(newF)
    setIsAddModalOpen(false)
    setFieldName('')
    setVariety('')
  }

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#E0E6DC] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#287A4B] uppercase tracking-wider block mb-1">
            Farm Plot Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2D] tracking-tight">
            My fields
          </h1>
          <p className="text-sm text-[#66756A] mt-1">
            Manage your agricultural plots, crop varieties, growth stages, and historical observation logs.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#123D2D] hover:bg-[#287A4B] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 self-start md:self-auto"
          leftIcon={<Plus className="w-4 h-4 text-[#6BA66B]" />}
        >
          Add New Field
        </Button>
      </div>

      {/* Field Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {fieldsList.map((f) => (
          <div
            key={f.id}
            onClick={() => setSelectedField(f)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white text-xs ${
              selectedField.id === f.id
                ? 'border-[#287A4B] ring-2 ring-[#287A4B]/20 shadow-sm'
                : 'border-[#E0E6DC] hover:border-[#6BA66B] shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E0E6DC]">
              <div className="flex items-center gap-1.5 font-bold text-[#123D2D]">
                <Leaf className="w-3.5 h-3.5 text-[#287A4B]" />
                <span className="text-sm">{f.name}</span>
              </div>
              <Badge
                variant={f.latestRisk === 'Elevated' ? 'warning' : 'success'}
                className="text-[10px]"
              >
                {f.latestRisk} Risk
              </Badge>
            </div>

            <div className="mt-3 space-y-1">
              <p className="font-bold text-[#1F3027]">
                {f.crop} — {f.variety}
              </p>
              <p className="text-[#66756A]">
                Stage: <strong className="text-[#1F3027]">{f.growthStage}</strong>
              </p>
              <p className="text-[#66756A]">
                Area: {f.areaHa} Hectares • {f.soilType}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#E0E6DC] flex items-center justify-between text-[11px] text-[#66756A]">
              <span>Check: {f.lastCropCheck}</span>
              <span className="font-bold text-[#287A4B]">View Plot</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Field Deep Detail View */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E6DC] shadow-xs space-y-6 text-xs text-[#1F3027]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E0E6DC] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#123D2D]">
                {selectedField.name} Plot Details
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E9F1E6] text-[#123D2D] font-bold text-[11px]">
                {selectedField.crop} ({selectedField.variety})
              </span>
            </div>
            <p className="text-xs text-[#66756A] mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#6BA66B]" />
              {selectedField.location} • GPS: {selectedField.coordinates}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onStartCropCheck}
              className="bg-[#123D2D] hover:bg-[#287A4B] text-white rounded-xl text-xs font-bold"
              leftIcon={<Camera className="w-3.5 h-3.5" />}
            >
              Add Crop Observation
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onViewWeatherRisk}
              className="rounded-xl text-xs font-bold border-[#E0E6DC]"
            >
              Weather Timeline
            </Button>
          </div>
        </div>

        {/* 4 Detail Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC]">
            <span className="text-[#66756A] block">Plot Area</span>
            <span className="text-base font-extrabold text-[#123D2D] mt-0.5 block">
              {selectedField.areaHa} Hectares
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC]">
            <span className="text-[#66756A] block">Soil Classification</span>
            <span className="text-base font-extrabold text-[#123D2D] mt-0.5 block truncate">
              {selectedField.soilType}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC]">
            <span className="text-[#66756A] block">Sowing Date</span>
            <span className="text-base font-extrabold text-[#123D2D] mt-0.5 block">
              {selectedField.sowingDate}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC]">
            <span className="text-[#66756A] block">Total Observations</span>
            <span className="text-base font-extrabold text-[#123D2D] mt-0.5 block">
              {selectedField.observationsCount} Recorded
            </span>
          </div>
        </div>

        {/* Observation & Diagnosis History Timeline */}
        <div className="space-y-3 pt-2">
          <h3 className="font-extrabold text-sm text-[#123D2D] flex items-center gap-2">
            <History className="w-4 h-4 text-[#287A4B]" />
            Field Observation Timeline & Diagnosis History
          </h3>

          <div className="space-y-2">
            {selectedField.historyItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8F7EF]/70 border border-[#E0E6DC] text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#287A4B]" />
                  <div>
                    <span className="font-bold text-[#1F3027] block">
                      {item.event}
                    </span>
                    <span className="text-[11px] text-[#66756A]">
                      {item.date}
                    </span>
                  </div>
                </div>

                <Badge
                  variant={item.status === 'Attention Needed' ? 'warning' : 'success'}
                  className="text-[10px]"
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Field Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E0E6DC] shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0E6DC]">
              <h3 className="font-extrabold text-base text-[#123D2D]">
                Register New Farm Plot
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-[#F8F7EF] text-[#66756A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateField} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#1F3027] mb-1">
                  Plot Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Canal Terrace"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E6DC] text-xs text-[#1F3027] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    Crop Type *
                  </label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E0E6DC] text-xs text-[#1F3027] outline-none bg-white"
                  >
                    <option value="Potato">Potato</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Rice">Rice</option>
                    <option value="Wheat">Wheat</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    Variety (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kufri Pukhraj"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E0E6DC] text-xs text-[#1F3027] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    Area (Hectares)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E0E6DC] text-xs text-[#1F3027] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    Sowing Date
                  </label>
                  <input
                    type="date"
                    value={sowingDate}
                    onChange={(e) => setSowingDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E0E6DC] text-xs text-[#1F3027] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E0E6DC] flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#123D2D] hover:bg-[#287A4B] text-white font-bold rounded-xl"
                >
                  Save Plot
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyFieldsView
