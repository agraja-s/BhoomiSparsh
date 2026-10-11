import React, { useState } from 'react'
import {
  Search,
  Printer,
  Calendar,
  Leaf,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import type { Language } from '../../utils/translations'

export interface HistoryReportsViewProps {
  language: Language
  onBackToDashboard: () => void
  onCheckCrop: () => void
}

export interface ScanRecord {
  id: string
  date: string
  field: string
  crop: string
  finding: string
  confidence: number
  riskLevel: 'Elevated' | 'Low' | 'Moderate'
  advisoryGiven: string
  followUpStatus: 'Needs Action' | 'Resolved' | 'Under Monitoring'
  image: string
}

const PAST_SCANS: ScanRecord[] = [
  {
    id: 'scan-101',
    date: 'Oct 11, 2026 (Today 08:30 AM)',
    field: 'North Plot',
    crop: 'Potato',
    finding: 'Late Blight (Phytophthora infestans)',
    confidence: 0.88,
    riskLevel: 'Elevated',
    advisoryGiven: 'Inspect lower canopy before evening dew; prune necrotic leaves; halt sprinkler irrigation.',
    followUpStatus: 'Needs Action',
    image: '/potato_crop.jpg',
  },
  {
    id: 'scan-100',
    date: 'Oct 08, 2026 (3 days ago)',
    field: 'East Terrace',
    crop: 'Tomato',
    finding: 'Early Blight (Alternaria solani) - Trace',
    confidence: 0.74,
    riskLevel: 'Moderate',
    advisoryGiven: 'Ensure soil mulch around base; monitor lower leaves for concentric rings.',
    followUpStatus: 'Under Monitoring',
    image: '/potato_crop.jpg',
  },
  {
    id: 'scan-099',
    date: 'Oct 02, 2026',
    field: 'South Valley',
    crop: 'Cotton',
    finding: 'Healthy Vegetative Growth',
    confidence: 0.94,
    riskLevel: 'Low',
    advisoryGiven: 'No fungal pathogen detected; maintain routine pest scouting.',
    followUpStatus: 'Resolved',
    image: '/potato_crop.jpg',
  },
  {
    id: 'scan-098',
    date: 'Sep 24, 2026',
    field: 'North Plot',
    crop: 'Potato',
    finding: 'Healthy Tuber Initiation',
    confidence: 0.96,
    riskLevel: 'Low',
    advisoryGiven: 'Hilling up soil completed; drip irrigation schedule optimal.',
    followUpStatus: 'Resolved',
    image: '/potato_crop.jpg',
  },
]

export const HistoryReportsView: React.FC<HistoryReportsViewProps> = ({
  language: _language,
  onBackToDashboard: _onBackToDashboard,
  onCheckCrop,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [cropFilter, setCropFilter] = useState('All')
  const [fieldFilter, setFieldFilter] = useState('All')

  const filteredScans = PAST_SCANS.filter((scan) => {
    const matchesSearch =
      scan.finding.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.crop.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCrop = cropFilter === 'All' || scan.crop === cropFilter
    const matchesField = fieldFilter === 'All' || scan.field === fieldFilter
    return matchesSearch && matchesCrop && matchesField
  })

  const handlePrintReport = () => {
    window.print()
  }

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto print:max-w-full">
      {/* Header */}
      <div className="pb-4 border-b border-[#E0E6DC] flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold text-[#287A4B] uppercase tracking-wider block mb-1">
            Historical Records & Audit
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2D] tracking-tight">
            Your crop health history
          </h1>
          <p className="text-sm text-[#66756A] mt-1">
            Browse past leaf scans, diagnostic findings, weather risk assessments, and follow-up records.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="outline"
            onClick={handlePrintReport}
            className="rounded-xl text-xs font-bold border-[#E0E6DC] text-[#123D2D] flex items-center gap-1.5"
            leftIcon={<Printer className="w-3.5 h-3.5 text-[#287A4B]" />}
          >
            Print Health Report
          </Button>

          <Button
            onClick={onCheckCrop}
            className="bg-[#123D2D] hover:bg-[#287A4B] text-white rounded-xl text-xs font-bold shadow-xs"
          >
            New Crop Scan
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E0E6DC] shadow-2xs space-y-3 print:hidden text-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#66756A] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by pathogen, crop, or plot name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E6DC] outline-none text-xs text-[#1F3027] focus:border-[#287A4B]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[#E0E6DC] bg-white outline-none text-xs text-[#1F3027]"
            >
              <option value="All">All Crops</option>
              <option value="Potato">Potato</option>
              <option value="Tomato">Tomato</option>
              <option value="Cotton">Cotton</option>
            </select>

            <select
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[#E0E6DC] bg-white outline-none text-xs text-[#1F3027]"
            >
              <option value="All">All Fields</option>
              <option value="North Plot">North Plot</option>
              <option value="East Terrace">East Terrace</option>
              <option value="South Valley">South Valley</option>
            </select>
          </div>
        </div>
      </div>

      {/* Printable Report Header (Visible on print) */}
      <div className="hidden print:block p-6 border-b-2 border-[#123D2D] mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#123D2D]">BhoomiSparsh Crop Health Report</h1>
            <p className="text-xs text-[#66756A]">Farm: Green Valley Farm • Pune District, Maharashtra</p>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold">Generated: {new Date().toLocaleDateString()}</p>
            <p className="text-[#66756A]">Lead Farmer: Ramesh Patil</p>
          </div>
        </div>
      </div>

      {/* Scans Timeline & List */}
      <div className="space-y-4">
        {filteredScans.map((scan) => (
          <div
            key={scan.id}
            className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E0E6DC] shadow-2xs space-y-4 text-xs text-[#1F3027]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E0E6DC] gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E9F1E6] flex items-center justify-center text-[#287A4B] font-bold shrink-0">
                  <Leaf className="w-5 h-5 text-[#287A4B]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#123D2D]">
                    {scan.field} — {scan.crop}
                  </h3>
                  <p className="text-[#66756A] text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#6BA66B]" />
                    {scan.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={scan.riskLevel === 'Elevated' ? 'warning' : 'success'}
                  className="text-[10px]"
                >
                  {scan.riskLevel} Risk
                </Badge>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    scan.followUpStatus === 'Needs Action'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : scan.followUpStatus === 'Under Monitoring'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  {scan.followUpStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 space-y-2">
                <div>
                  <span className="font-bold text-[#66756A] text-[11px] block">
                    Diagnostic Finding:
                  </span>
                  <p className="font-extrabold text-sm text-[#123D2D]">
                    {scan.finding}{' '}
                    <span className="font-semibold text-xs text-[#287A4B]">
                      ({Math.round(scan.confidence * 100)}% Confidence)
                    </span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#F8F7EF] border border-[#E0E6DC]">
                  <span className="font-bold text-[#123D2D] block text-[11px]">
                    Prescribed Cultural Advisory:
                  </span>
                  <p className="text-[#1F3027] text-xs mt-0.5 leading-relaxed">
                    {scan.advisoryGiven}
                  </p>
                </div>
              </div>

              <div className="md:col-span-4 shrink-0 flex items-center justify-center">
                <div className="w-full h-28 rounded-2xl overflow-hidden border border-[#E0E6DC]">
                  <img
                    src={scan.image}
                    alt={scan.finding}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryReportsView
