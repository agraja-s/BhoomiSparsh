import React, { useState } from 'react'
import {
  Sprout,
  LayoutDashboard,
  MapPin,
  Camera,
  CloudSun,
  ShieldAlert,
  History,
  Settings,
  Bell,
  ArrowLeft,
  User,
  Radio,
  Sparkles,
  Leaf,
} from 'lucide-react'
import type { Language } from '../../utils/translations'

export interface LayoutProps {
  children: React.ReactNode
  isMockMode: boolean
  apiBaseUrl: string
  language: Language
  onLanguageChange: (lang: Language) => void
  onNavigateHome: () => void
  activeNav?: string
  onNavigate?: (nav: string) => void
  onStartScan?: () => void
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  isMockMode,
  language,
  onLanguageChange,
  onNavigateHome,
  activeNav = 'dashboard',
  onNavigate,
  onStartScan,
}) => {
  const [showNotifications, setShowNotifications] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'my-fields', label: 'My Fields', icon: MapPin },
    { id: 'scan', label: 'Check My Crop', icon: Camera, highlight: true },
    { id: 'weather-risk', label: 'Weather & Risk', icon: CloudSun },
    { id: 'advisories', label: 'Farmer Advisory', icon: ShieldAlert },
    { id: 'history', label: 'History & Reports', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleNavClick = (id: string) => {
    if (id === 'scan' && onStartScan) {
      onStartScan()
      return
    }
    if (onNavigate) {
      onNavigate(id)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7EF] text-[#1F3027] font-sans antialiased flex flex-col md:flex-row selection:bg-[#E9F1E6] selection:text-[#123D2D]">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. DESKTOP LEFT SIDEBAR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-[#E0E6DC] shrink-0 sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E0E6DC]/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-3 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#287A4B] rounded-xl"
            title="Return to Public Home"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#123D2D] flex items-center justify-center text-[#E9F1E6] shadow-xs group-hover:bg-[#287A4B] transition-colors">
              <Sprout className="w-5 h-5 text-[#6BA66B]" />
            </div>
            <div>
              <span className="font-extrabold text-[#123D2D] text-lg tracking-tight block">
                BhoomiSparsh
              </span>
              <span className="text-[11px] font-medium text-[#66756A] block">
                Warn Early. Save Crops.
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold text-[#66756A] tracking-wider uppercase">
            Farm Operations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#E9F1E6] text-[#123D2D] shadow-xs border border-[#287A4B]/20'
                    : item.highlight
                    ? 'text-[#287A4B] hover:bg-[#E9F1E6]/60'
                    : 'text-[#66756A] hover:text-[#123D2D] hover:bg-[#F8F7EF]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#287A4B]' : item.highlight ? 'text-[#287A4B]' : 'text-[#66756A]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.highlight && (
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#287A4B] text-white">
                    Scan
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer: Farm Identity & Exit to Landing */}
        <div className="p-4 border-t border-[#E0E6DC] bg-[#F8F7EF]/60 space-y-3">
          <div className="p-3 rounded-xl bg-white border border-[#E0E6DC] shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#123D2D]">
              <Leaf className="w-3.5 h-3.5 text-[#287A4B]" />
              <span>Green Valley Farm</span>
            </div>
            <p className="text-[11px] text-[#66756A] mt-0.5">
              Pune District • 2.5 Hectares
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-[#66756A] hover:text-[#123D2D] hover:bg-white rounded-lg border border-transparent hover:border-[#E0E6DC] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Landing Page</span>
          </button>
        </div>
      </aside>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. MAIN APPLICATION CONTENT AREA */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E0E6DC] px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Mobile Brand / Desktop Farm Breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={onNavigateHome}
                className="w-8 h-8 rounded-xl bg-[#123D2D] flex items-center justify-center text-[#E9F1E6]"
              >
                <Sprout className="w-4 h-4 text-[#6BA66B]" />
              </button>
              <span className="font-extrabold text-[#123D2D] text-base tracking-tight">
                BhoomiSparsh
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="font-bold text-[#123D2D] px-2.5 py-1 rounded-lg bg-[#E9F1E6] border border-[#287A4B]/20 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-[#287A4B]" />
                Green Valley Farm
              </span>
              <span className="text-[#66756A]">•</span>
              <span className="text-[#66756A] flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#6BA66B]" />
                Pune District, Maharashtra
              </span>
            </div>
          </div>

          {/* Right Header Utilities: Language, Notifications, Farmer Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mode Tag */}
            {isMockMode ? (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Radio className="w-3 h-3 text-amber-600" />
                DEMO DATA
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                LIVE
              </span>
            )}

            {/* Language Selector */}
            <div className="flex items-center gap-0.5 bg-[#F8F7EF] p-0.5 rounded-xl border border-[#E0E6DC]">
              {(['en', 'mr', 'hi'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    language === lang
                      ? 'bg-[#123D2D] text-white shadow-2xs'
                      : 'text-[#66756A] hover:text-[#123D2D]'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'mr' ? 'मराठी' : 'हिंदी'}
                </button>
              ))}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-xl border border-[#E0E6DC] bg-white flex items-center justify-center text-[#1F3027] hover:bg-[#F8F7EF] transition-colors relative cursor-pointer"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4 text-[#1F3027]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E5A52C]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E0E6DC] p-4 z-50 text-left">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E0E6DC]">
                    <span className="font-bold text-xs text-[#123D2D]">Alerts & Advisories</span>
                    <span className="text-[10px] text-[#66756A]">1 New Advisory</span>
                  </div>
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                    <p className="font-bold text-amber-900">Potato Late Blight Warning</p>
                    <p className="text-amber-800 text-[11px]">
                      High humidity forecasted over next 48h for Pune district. Check North Plot lower canopy.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[#E0E6DC]">
              <img
                src="/farmer_avatar.jpg"
                alt="Ramesh Patil"
                className="w-8 h-8 rounded-full object-cover border border-[#287A4B]/30"
              />
              <div className="hidden lg:block text-left text-xs leading-tight">
                <span className="font-bold text-[#123D2D] block">Ramesh Patil</span>
                <span className="text-[10px] text-[#66756A] block">Lead Farmer</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Children Container */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. MOBILE FIXED BOTTOM NAVIGATION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[#E0E6DC] px-2 py-1.5 z-40 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => handleNavClick('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-semibold cursor-pointer ${
            activeNav === 'dashboard' ? 'text-[#287A4B]' : 'text-[#66756A]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick('my-fields')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-semibold cursor-pointer ${
            activeNav === 'my-fields' ? 'text-[#287A4B]' : 'text-[#66756A]'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>My Crops</span>
        </button>

        {/* Elevated Scan Button */}
        <button
          type="button"
          onClick={onStartScan}
          className="flex flex-col items-center -mt-6 cursor-pointer group"
          title="Scan Crop"
        >
          <div className="w-13 h-13 rounded-full bg-[#123D2D] text-white flex items-center justify-center shadow-lg border-3 border-white group-active:scale-95 transition-transform">
            <Camera className="w-6 h-6 text-[#E9F1E6]" />
          </div>
          <span className="text-[10px] font-bold text-[#123D2D] mt-0.5">Scan</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick('weather-risk')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-semibold cursor-pointer ${
            activeNav === 'weather-risk' ? 'text-[#287A4B]' : 'text-[#66756A]'
          }`}
        >
          <CloudSun className="w-5 h-5" />
          <span>Weather</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick('settings')}
          className={`flex flex-col items-center gap-0.5 p-1 rounded-xl text-[10px] font-semibold cursor-pointer ${
            activeNav === 'settings' ? 'text-[#287A4B]' : 'text-[#66756A]'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  )
}

export default Layout
