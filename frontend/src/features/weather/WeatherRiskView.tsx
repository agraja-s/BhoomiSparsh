import React, { useState } from 'react'
import {
  Thermometer,
  Droplets,
  CloudRain,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Leaf,
  Clock,
  TrendingUp,
} from 'lucide-react'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
} from 'recharts'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import type { Language } from '../../utils/translations'

export interface WeatherRiskViewProps {
  language: Language
  onBackToDashboard: () => void
  onViewAdvisories: () => void
}

type Horizon = '24h' | '72h' | '7d'

interface HourlyDataPoint {
  time: string
  riskScore: number
  upperUncertainty: number
  lowerUncertainty: number
  temperature: number
  humidity: number
  rainMm: number
  isFavorable: boolean
}

const TIMELINE_DATA_72H: HourlyDataPoint[] = [
  { time: 'Today 06:00', riskScore: 68, upperUncertainty: 75, lowerUncertainty: 60, temperature: 21.0, humidity: 92, rainMm: 0.2, isFavorable: true },
  { time: 'Today 12:00', riskScore: 78, upperUncertainty: 84, lowerUncertainty: 70, temperature: 24.5, humidity: 85, rainMm: 0.0, isFavorable: false },
  { time: 'Today 18:00', riskScore: 84, upperUncertainty: 90, lowerUncertainty: 78, temperature: 20.8, humidity: 94, rainMm: 1.2, isFavorable: true },
  { time: 'Tomorrow 00:00', riskScore: 88, upperUncertainty: 94, lowerUncertainty: 80, temperature: 19.1, humidity: 96, rainMm: 1.8, isFavorable: true },
  { time: 'Tomorrow 06:00', riskScore: 82, upperUncertainty: 88, lowerUncertainty: 74, temperature: 20.4, humidity: 92, rainMm: 0.8, isFavorable: true },
  { time: 'Tomorrow 12:00', riskScore: 65, upperUncertainty: 72, lowerUncertainty: 56, temperature: 26.2, humidity: 76, rainMm: 0.0, isFavorable: false },
  { time: 'Tomorrow 18:00', riskScore: 70, upperUncertainty: 78, lowerUncertainty: 62, temperature: 22.0, humidity: 88, rainMm: 0.4, isFavorable: true },
  { time: 'Day 3 00:00', riskScore: 55, upperUncertainty: 64, lowerUncertainty: 46, temperature: 18.5, humidity: 80, rainMm: 0.0, isFavorable: false },
  { time: 'Day 3 06:00', riskScore: 48, upperUncertainty: 58, lowerUncertainty: 40, temperature: 19.8, humidity: 75, rainMm: 0.0, isFavorable: false },
  { time: 'Day 3 12:00', riskScore: 35, upperUncertainty: 44, lowerUncertainty: 28, temperature: 27.5, humidity: 62, rainMm: 0.0, isFavorable: false },
]

export const WeatherRiskView: React.FC<WeatherRiskViewProps> = ({
  language: _language,
  onBackToDashboard: _onBackToDashboard,
  onViewAdvisories,
}) => {
  const [horizon, setHorizon] = useState<Horizon>('72h')
  const [selectedDisease] = useState('Late Blight (Phytophthora infestans)')

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. HEADER & HORIZON SELECTOR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="pb-4 border-b border-[#E0E6DC] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#347CB4] uppercase tracking-wider block mb-1">
            Micro-Climatic Predictive Assessment
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2D] tracking-tight">
            Understand the risk before it spreads.
          </h1>
          <p className="text-sm text-[#66756A] mt-1">
            See how local environmental conditions may affect your crop over the forecast horizon.
          </p>
        </div>

        {/* Horizon Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-[#E0E6DC] self-start md:self-auto shadow-2xs">
          <span className="text-[11px] font-bold text-[#66756A] px-2.5">Horizon:</span>
          {(['24h', '72h', '7d'] as Horizon[]).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                horizon === h
                  ? 'bg-[#123D2D] text-white shadow-xs'
                  : 'text-[#66756A] hover:text-[#123D2D]'
              }`}
            >
              {h === '24h' ? '24 Hours' : h === '72h' ? '72 Hours' : '7 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. FIELD CONTEXT & CURRENT OBSERVATION ROW */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Field Context Card */}
        <div className="md:col-span-5 p-5 rounded-2xl bg-white border border-[#E0E6DC] shadow-2xs space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E0E6DC]">
            <span className="font-bold text-[#66756A] uppercase tracking-wider text-[11px]">
              Assessed Plot & Target Pathogen
            </span>
            <Badge variant="mock" dot className="text-[10px]">
              DEMO DATA
            </Badge>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#287A4B]" />
              <strong className="text-sm font-extrabold text-[#123D2D]">
                North Plot — Potato (Kufri Jyoti)
              </strong>
            </div>
            <p className="text-[#66756A] mt-0.5">
              Assessing: <strong className="text-[#1F3027]">{selectedDisease}</strong>
            </p>
          </div>

          <div className="pt-2 border-t border-[#E0E6DC] flex items-center justify-between text-[#66756A]">
            <span>Station: Pune District (Baramati KVK)</span>
            <span className="flex items-center gap-1 font-semibold text-[#1F3027]">
              <Clock className="w-3 h-3 text-[#287A4B]" />
              Updated 15 mins ago
            </span>
          </div>
        </div>

        {/* Current Weather Snapshot Panel */}
        <div className="md:col-span-7 p-5 rounded-2xl bg-white border border-[#E0E6DC] shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E0E6DC] text-[11px] font-bold text-[#66756A]">
            <span>CURRENT MICRO-CLIMATE METRICS</span>
            <span className="text-[#347CB4]">Open-Meteo High-Resolution Feed</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
            <div className="p-2.5 rounded-xl bg-[#F8F7EF] border border-[#E0E6DC]">
              <span className="text-[#66756A] flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-[#E5A52C]" />
                Temp
              </span>
              <div className="text-lg font-black text-[#123D2D] mt-1">22.4°C</div>
              <span className="text-[10px] text-[#66756A]">Mild canopy</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#F8F7EF] border border-[#E0E6DC]">
              <span className="text-[#66756A] flex items-center gap-1">
                <Droplets className="w-3 h-3 text-[#347CB4]" />
                Humidity
              </span>
              <div className="text-lg font-black text-[#347CB4] mt-1">91% RH</div>
              <span className="text-[10px] text-[#C74C43] font-bold">Favorable</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#F8F7EF] border border-[#E0E6DC]">
              <span className="text-[#66756A] flex items-center gap-1">
                <CloudRain className="w-3 h-3 text-[#347CB4]" />
                Rainfall
              </span>
              <div className="text-lg font-black text-[#123D2D] mt-1">1.8 mm</div>
              <span className="text-[10px] text-[#66756A]">65% chance</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#F8F7EF] border border-[#E0E6DC]">
              <span className="text-[#66756A] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#287A4B]" />
                Leaf Wetness
              </span>
              <div className="text-lg font-black text-[#287A4B] mt-1">6.5 hrs</div>
              <span className="text-[10px] text-[#66756A]">Tonight est.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. RISK OVERVIEW HERO CARD */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-linear-to-br from-[#FFFDF5] to-[#FBF7E8] border border-[#E5A52C]/40 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E5A52C] text-white flex items-center justify-center font-black shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[#9A6A12] uppercase tracking-wider">
                  Elevated Pathogen Risk
                </span>
                <span className="text-xs bg-white/80 px-2 py-0.5 rounded-md font-bold text-[#725039] border border-[#E0E6DC]">
                  Risk Index: 82 / 100
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-[#123D2D]">
                Weather favors Phytophthora spore release over next 36–48 hours
              </h2>
            </div>
          </div>

          <div className="text-right shrink-0 text-xs">
            <span className="text-[#66756A] block">Model Uncertainty:</span>
            <span className="font-bold text-[#123D2D] block">±8% Band • 12h Regional Observation</span>
          </div>
        </div>

        <p className="text-xs text-[#1F3027] leading-relaxed">
          <strong>What this means:</strong> Late blight requires temperatures between 18°C and 22°C paired with leaf moisture lasting &gt;6 continuous hours. Upcoming rainfall and high nighttime humidity satisfy both biological triggers.
        </p>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. FORECAST CHART (RECHARTS TIME-SERIES CURVE) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-white border border-[#E0E6DC] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E0E6DC] gap-2">
          <div>
            <h3 className="font-extrabold text-[#123D2D] text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#287A4B]" />
              72-Hour Micro-Climate & Disease Risk Trajectory
            </h3>
            <p className="text-xs text-[#66756A]">
              Combined pathogen risk index (0–100) alongside canopy temperature (°C) and relative humidity (%)
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-[#66756A]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#C74C43]" />
              Risk Index
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#347CB4]" />
              Humidity (%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#E5A52C]" />
              Temp (°C)
            </span>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={TIMELINE_DATA_72H} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E6DC" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#66756A' }} />
              <YAxis
                yAxisId="risk"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#123D2D' }}
                label={{ value: 'Risk Index / Humidity', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#66756A' }}
              />
              <YAxis
                yAxisId="temp"
                orientation="right"
                domain={[10, 35]}
                tick={{ fontSize: 11, fill: '#E5A52C' }}
                label={{ value: 'Temp (°C)', angle: 90, position: 'insideRight', fontSize: 10, fill: '#E5A52C' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E0E6DC',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              {/* Highlight favorable window */}
              <ReferenceArea
                yAxisId="risk"
                x1="Today 18:00"
                x2="Tomorrow 06:00"
                stroke="#C74C43"
                strokeOpacity={0.3}
                fill="#C74C43"
                fillOpacity={0.08}
              />
              {/* Risk Area with Uncertainty */}
              <Area
                yAxisId="risk"
                type="monotone"
                dataKey="riskScore"
                name="Pathogen Risk"
                stroke="#C74C43"
                strokeWidth={3}
                fill="#C74C43"
                fillOpacity={0.15}
              />
              {/* Humidity Line */}
              <Line
                yAxisId="risk"
                type="monotone"
                dataKey="humidity"
                name="Relative Humidity (%)"
                stroke="#347CB4"
                strokeWidth={2}
                dot={false}
              />
              {/* Temperature Line */}
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                stroke="#E5A52C"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[11px] text-[#66756A] text-center pt-2">
          *Shaded pink area indicates high-moisture nocturnal period with optimal spore germination conditions.
        </p>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. "WHY THIS RISK?" EXPLANATION PANEL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-3xl border border-[#E0E6DC] shadow-2xs space-y-4 text-xs">
        <h3 className="font-extrabold text-sm text-[#123D2D] flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#287A4B]" />
          Why This Risk Assessment? (Biological & Climatic Factors)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC] space-y-2">
            <span className="font-bold text-[#123D2D] block">
              Factors Increasing Concern:
            </span>
            <ul className="space-y-1 text-[#1F3027]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#C74C43] font-bold">•</span>
                <span>Overnight dew forecast: 6.5 hours of continuous surface leaf film.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#C74C43] font-bold">•</span>
                <span>Mild canopy temps (19°C – 21°C) match peak sporulation kinetics.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#C74C43] font-bold">•</span>
                <span>Previous crop scan showed suspicious water-soaked lesions in lower canopy.</span>
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC] space-y-2">
            <span className="font-bold text-[#123D2D] block">
              Mitigating Factors & Limitations:
            </span>
            <ul className="space-y-1 text-[#1F3027]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#287A4B] font-bold">•</span>
                <span>Daytime sunny intervals tomorrow (26.2°C, 70% RH) will partially dry foliage.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#66756A] font-bold">•</span>
                <span>Soil sensor in North Plot indicates good drainage without water stagnation.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#E5A52C] font-bold">•</span>
                <span>Regional wind speed &gt;12 km/h may accelerate canopy drying if leaves are trimmed.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Evidence-Based Next Step Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-[#E9F1E6] border border-[#287A4B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-bold text-[#123D2D] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#287A4B]" />
              Actionable Farming Guidance (Do NOT Spray Immediately):
            </span>
            <p className="text-[#1F3027] text-xs">
              Inspect the lower leaves of North Plot plants before evening dew. Prune affected foliage to increase air circulation. Re-evaluate forecast in 24 hours.
            </p>
          </div>

          <Button
            onClick={onViewAdvisories}
            className="bg-[#123D2D] hover:bg-[#287A4B] text-white font-extrabold text-xs py-3 px-5 rounded-xl shrink-0"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Open Farmer Advisory
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WeatherRiskView
