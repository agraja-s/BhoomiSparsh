import React, { useState } from 'react'
import {
  Globe,
  MapPin,
  Bell,
  Eye,
  PhoneCall,
  Save,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import type { Language } from '../../utils/translations'

export interface ProfileSettingsViewProps {
  language: Language
  onLanguageChange: (lang: Language) => void
  onBackToDashboard: () => void
  currentUser?: import('../../types/auth').FarmerProfile | null
  onOpenAuth?: () => void
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  language,
  onLanguageChange,
  onBackToDashboard: _onBackToDashboard,
  currentUser,
  onOpenAuth,
}) => {
  const [fullName, setFullName] = useState(currentUser?.fullName || 'Ramesh Patil')
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98220 41209')
  const [district, setDistrict] = useState(
    currentUser ? `${currentUser.district}, ${currentUser.state}` : 'Pune District, Maharashtra'
  )
  const [_preferredCrops, _setPreferredCrops] = useState<string[]>(
    currentUser?.primaryCrops || ['Potato', 'Tomato', 'Cotton']
  )
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [whatsappAlerts, setWhatsappAlerts] = useState(true)
  const [largeText, setLargeText] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-[#E0E6DC] flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[#287A4B] uppercase tracking-wider block mb-1">
            Account Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2D] tracking-tight">
            Profile & Settings
          </h1>
          <p className="text-sm text-[#66756A] mt-1">
            Configure farmer identity, trilingual preferences, field locations, and early-warning notification channels.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="bg-[#123D2D] hover:bg-[#287A4B] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          leftIcon={<Save className="w-3.5 h-3.5 text-[#6BA66B]" />}
        >
          {isSaved ? 'Preferences Saved' : 'Save Settings'}
        </Button>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#E0E6DC] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatarUrl || '/farmer_avatar.jpg'}
              alt={fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#287A4B]"
            />
            <div>
              <h2 className="text-lg font-extrabold text-[#123D2D]">{fullName}</h2>
              <p className="text-xs text-[#66756A]">
                Farmer ID: <strong>{currentUser?.farmerIdCode || '#MH-PUN-8419'}</strong> •{' '}
                {currentUser?.farmName || 'Green Valley Farm'} ({currentUser?.landSizeHectares || 2.5} Ha)
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#E9F1E6] text-[#123D2D] text-[11px] font-bold">
                {currentUser?.role === 'extension_officer'
                  ? 'Agricultural Extension Officer'
                  : 'Verified Farmer Member'}
              </span>
            </div>
          </div>

          {onOpenAuth && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAuth}
              className="rounded-xl text-xs font-bold border-[#E0E6DC] text-[#123D2D] self-start sm:self-auto cursor-pointer"
            >
              Switch Farmer Account
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E0E6DC] text-xs">
          <div>
            <label className="block font-bold text-[#1F3027] mb-1">
              Farmer Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E6DC] text-xs text-[#1F3027] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1F3027] mb-1">
              Mobile Contact (for Early Warning SMS)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E6DC] text-xs text-[#1F3027] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Language Selector Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#E0E6DC] shadow-2xs space-y-3 text-xs">
        <h3 className="font-extrabold text-sm text-[#123D2D] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#287A4B]" />
          Preferred Display Language
        </h3>
        <p className="text-[#66756A]">
          Choose the regional language used for agricultural advisories and weather risk alerts.
        </p>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {(
            [
              { id: 'en', label: 'English', sub: 'Default' },
              { id: 'mr', label: 'मराठी', sub: 'Marathi' },
              { id: 'hi', label: 'हिंदी', sub: 'Hindi' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onLanguageChange(item.id)}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                language === item.id
                  ? 'border-[#287A4B] bg-[#E9F1E6] text-[#123D2D] font-extrabold shadow-2xs'
                  : 'border-[#E0E6DC] bg-[#F8F7EF] text-[#66756A] hover:text-[#123D2D]'
              }`}
            >
              <span className="block text-sm">{item.label}</span>
              <span className="text-[10px] opacity-75">{item.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Farm Location & Micro-Climate Hub */}
      <div className="p-6 rounded-3xl bg-white border border-[#E0E6DC] shadow-2xs space-y-3 text-xs">
        <h3 className="font-extrabold text-sm text-[#123D2D] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#287A4B]" />
          Farm Location & Meteorological Station
        </h3>
        <p className="text-[#66756A]">
          High-resolution micro-climatic models rely on local station coordinates for disease risk forecasting.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block font-bold text-[#1F3027] mb-1">
              Agricultural District
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E6DC] text-xs text-[#1F3027] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1F3027] mb-1">
              GPS Coordinates Status
            </label>
            <div className="px-3.5 py-2.5 rounded-xl bg-[#F8F7EF] border border-[#E0E6DC] text-[#66756A] flex items-center justify-between">
              <span>18.5204° N, 73.8567° E (Pune)</span>
              <Badge variant="success" className="text-[10px]">
                Valid
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 rounded-3xl bg-white border border-[#E0E6DC] shadow-2xs space-y-4 text-xs">
        <h3 className="font-extrabold text-sm text-[#123D2D] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#287A4B]" />
          Disease Early-Warning Notification Channels
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC] cursor-pointer">
            <div>
              <span className="font-bold text-[#123D2D] block">
                SMS Urgent Alerts
              </span>
              <span className="text-[#66756A] text-[11px]">
                Receive instant SMS alerts when high humidity & temp align with pathogen risk.
              </span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 text-[#287A4B] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC] cursor-pointer">
            <div>
              <span className="font-bold text-[#123D2D] block">
                WhatsApp Weekly Advisory Digests
              </span>
              <span className="text-[#66756A] text-[11px]">
                Get non-chemical cultural practices sent directly to your phone.
              </span>
            </div>
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={(e) => setWhatsappAlerts(e.target.checked)}
              className="w-4 h-4 text-[#287A4B] rounded"
            />
          </label>
        </div>
      </div>

      {/* Accessibility & High Contrast */}
      <div className="p-6 rounded-3xl bg-white border border-[#E0E6DC] shadow-2xs space-y-3 text-xs">
        <h3 className="font-extrabold text-sm text-[#123D2D] flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#287A4B]" />
          Accessibility & Field Readability
        </h3>

        <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC] cursor-pointer">
          <div>
            <span className="font-bold text-[#123D2D] block">
              High-Contrast Sunlight Mode
            </span>
            <span className="text-[#66756A] text-[11px]">
              Increases font contrast and border thickness for outdoor readability under direct sunlight.
            </span>
          </div>
          <input
            type="checkbox"
            checked={largeText}
            onChange={(e) => setLargeText(e.target.checked)}
            className="w-4 h-4 text-[#287A4B] rounded"
          />
        </label>
      </div>

      {/* Farmer Support & Helpline */}
      <div className="p-6 rounded-3xl bg-[#E9F1E6] border border-[#287A4B]/20 space-y-3 text-xs text-[#123D2D]">
        <h3 className="font-extrabold text-sm flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-[#287A4B]" />
          Krishi Vigyan Kendra & Kisan Helpline Support
        </h3>
        <p className="leading-relaxed">
          For physical plant tissue confirmation, contact your local state agricultural extension officer or call the national Kisan Call Center at <strong>1800-180-1551</strong> (Toll Free, 6 AM to 10 PM).
        </p>
      </div>
    </div>
  )
}

export default ProfileSettingsView
