import React from 'react'
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  CloudSun,
  Droplets,
  Thermometer,
  CloudRain,
  Camera,
  Activity,
  CheckCircle2,
  Globe,
  Leaf,
  TrendingUp,
  MapPin,
  ChevronRight,
  FileText,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import type { Language } from '../../utils/translations'

export interface BhoomiLandingPageProps {
  language: Language
  onLanguageChange: (lang: Language) => void
  onCheckCrop: () => void
  onViewWeatherRisk: () => void
  onEnterDashboard: () => void
}

export const BhoomiLandingPage: React.FC<BhoomiLandingPageProps> = ({
  language,
  onLanguageChange,
  onCheckCrop,
  onViewWeatherRisk,
  onEnterDashboard,
}) => {
  return (
    <div className="min-h-screen bg-[#F8F7EF] text-[#1F3027] font-sans antialiased selection:bg-[#E9F1E6] selection:text-[#123D2D]">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. PUBLIC HEADER / NAVIGATION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#F8F7EF]/90 backdrop-blur-md border-b border-[#E0E6DC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#123D2D] flex items-center justify-center text-[#E9F1E6] shadow-sm">
              <Sprout className="w-6 h-6 text-[#6BA66B]" />
            </div>
            <div>
              <span className="font-extrabold text-[#123D2D] text-xl sm:text-2xl tracking-tight">
                BhoomiSparsh
              </span>
              <p className="text-[11px] font-medium text-[#66756A] hidden sm:block">
                Warn Early. Save Crops.
              </p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#1F3027]">
            <a href="#home" className="text-[#287A4B] transition-colors">
              Home
            </a>
            <a href="#how-it-works" className="text-[#66756A] hover:text-[#123D2D] transition-colors">
              How It Works
            </a>
            <a href="#crop-health" className="text-[#66756A] hover:text-[#123D2D] transition-colors">
              Crop Health
            </a>
            <a href="#weather-risk" className="text-[#66756A] hover:text-[#123D2D] transition-colors">
              Weather Risk
            </a>
            <a href="#about" className="text-[#66756A] hover:text-[#123D2D] transition-colors">
              About
            </a>
          </nav>

          {/* Language Selector & CTA */}
          <div className="flex items-center gap-3">
            {/* Language Selector Pill */}
            <div className="flex items-center gap-1 bg-white border border-[#E0E6DC] p-1 rounded-xl shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-[#66756A] ml-1.5 hidden sm:block" />
              {(['en', 'mr', 'hi'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    language === lang
                      ? 'bg-[#123D2D] text-white shadow-2xs'
                      : 'text-[#66756A] hover:text-[#123D2D] hover:bg-[#E9F1E6]/50'
                  }`}
                  aria-pressed={language === lang}
                >
                  {lang === 'en' ? 'EN' : lang === 'mr' ? 'मराठी' : 'हिंदी'}
                </button>
              ))}
            </div>

            {/* Primary Action Button */}
            <Button
              size="md"
              onClick={onEnterDashboard}
              className="bg-[#123D2D] hover:bg-[#287A4B] text-white font-bold rounded-xl px-5 py-2.5 shadow-sm text-sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. HERO SECTION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="home" className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F1E6] border border-[#6BA66B]/30 text-[#123D2D] text-xs font-bold tracking-wide">
              <Leaf className="w-3.5 h-3.5 text-[#287A4B]" />
              <span>SMART CROP CARE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-[#123D2D] tracking-tight leading-[1.15]">
              Healthy Crops for a Brighter Tomorrow
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#66756A] leading-relaxed max-w-xl">
              Check your crop health, understand weather-related disease risks, and get simple farming guidance — all in one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Button
                size="lg"
                onClick={onCheckCrop}
                className="bg-[#123D2D] hover:bg-[#287A4B] text-white font-bold rounded-2xl px-7 py-4 text-base shadow-md cursor-pointer justify-center"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Check My Crop
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onViewWeatherRisk}
                className="border-2 border-[#123D2D] text-[#123D2D] hover:bg-[#E9F1E6] font-bold rounded-2xl px-6 py-4 text-base cursor-pointer justify-center bg-transparent"
                leftIcon={<CloudSun className="w-5 h-5 text-[#287A4B]" />}
              >
                View Weather Risk
              </Button>
            </div>

            {/* Trust Statement */}
            <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-[#66756A]">
              <ShieldCheck className="w-4 h-4 text-[#287A4B]" />
              <span>Early warnings. Smarter decisions. Healthier harvests.</span>
            </div>

            {/* Three Quick Badges (Inspired by Reference Image 1) */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E0E6DC]">
              <div className="p-3 rounded-2xl bg-white border border-[#E0E6DC] text-left shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#E9F1E6] text-[#287A4B] flex items-center justify-center mb-1.5">
                  <Sprout className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#123D2D]">Smart Farming</h4>
                <p className="text-[11px] text-[#66756A] mt-0.5 leading-tight">Data-driven decisions</p>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#E0E6DC] text-left shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#E9F1E6] text-[#287A4B] flex items-center justify-center mb-1.5">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#123D2D]">Crop Health</h4>
                <p className="text-[11px] text-[#66756A] mt-0.5 leading-tight">Early symptom detection</p>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#E0E6DC] text-left shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#E9F1E6] text-[#287A4B] flex items-center justify-center mb-1.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#123D2D]">Better Yield</h4>
                <p className="text-[11px] text-[#66756A] mt-0.5 leading-tight">Sustainable harvest</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Blend */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white">
              <img
                src="/bhoomisparsh_hero.jpg"
                alt="Indian farmer inspecting healthy crop leaf in golden sunlight"
                className="w-full h-auto object-cover object-center max-h-[460px]"
              />

              {/* Subtle organic gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#123D2D]/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Status Pill over image */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-white/40 shadow-md text-left flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#287A4B] text-white flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#123D2D]">Micro-Climate Early Warning</h5>
                    <p className="text-[11px] text-[#66756A]">Active in Maharashtra & Gujarat</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E9F1E6] text-[#123D2D] px-2 py-1 rounded-full">
                  LIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. FLOATING WEATHER PREVIEW PANEL (Below Hero) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-2 mb-16">
        <div className="rounded-3xl bg-white border border-[#E0E6DC] p-5 sm:p-7 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Location & Tag */}
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E9F1E6] text-[#287A4B] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[#123D2D] text-base sm:text-lg">
                    Pune District, Maharashtra
                  </h3>
                  <Badge variant="mock" className="text-[10px] py-0 px-2">
                    DEMO DATA
                  </Badge>
                </div>
                <p className="text-xs text-[#66756A]">
                  Open-Meteo Micro-Climate Weather Station
                </p>
              </div>
            </div>

            {/* Meteorological Metrics */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 text-left border-y sm:border-y-0 sm:border-x border-[#E0E6DC] py-3 sm:py-0 sm:px-8">
              <div>
                <span className="text-[11px] font-bold text-[#66756A] uppercase flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-orange-600" />
                  Temp
                </span>
                <p className="text-base sm:text-xl font-extrabold text-[#123D2D] mt-0.5">
                  24°C
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#66756A] uppercase flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-[#347CB4]" />
                  Humidity
                </span>
                <p className="text-base sm:text-xl font-extrabold text-[#123D2D] mt-0.5">
                  82% RH
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#66756A] uppercase flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                  Rainfall
                </span>
                <p className="text-base sm:text-xl font-extrabold text-[#123D2D] mt-0.5 truncate">
                  Light Rain in 18h
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="self-start md:self-center">
              <Button
                variant="forest"
                size="md"
                onClick={onViewWeatherRisk}
                className="bg-[#123D2D] hover:bg-[#287A4B] text-white font-bold rounded-xl px-5 py-2.5 text-xs sm:text-sm shadow-xs"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                View Forecast
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. FEATURE SECTION: "Your Crop Health at a Glance" */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="crop-health" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-left space-y-3 mb-10 max-w-2xl">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#287A4B]">
            CORE CAPABILITIES
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#123D2D] tracking-tight">
            Your Crop Health at a Glance
          </h2>
          <p className="text-sm sm:text-base text-[#66756A]">
            Comprehensive agricultural protection engineered to prevent loss before symptoms spread.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Crop Health */}
          <div className="rounded-3xl bg-white border border-[#E0E6DC] p-6 text-left shadow-sm hover:shadow-md transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#E9F1E6] text-[#287A4B] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#123D2D]">Crop Health Analysis</h3>
              <p className="text-xs sm:text-sm text-[#66756A] mt-1.5 leading-relaxed">
                Check your crop for possible disease symptoms using smartphone camera photography.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-[#1F3027] pt-2 border-t border-[#E0E6DC]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#287A4B]" />
                <span>Instant leaf spot & lesion detection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#287A4B]" />
                <span>Diagnostic confidence & uncertainty notes</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                type="button"
                onClick={onCheckCrop}
                className="text-xs font-bold text-[#287A4B] group-hover:text-[#123D2D] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Diagnose Plant Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Weather Risk */}
          <div className="rounded-3xl bg-white border border-[#E0E6DC] p-6 text-left shadow-sm hover:shadow-md transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#347CB4] flex items-center justify-center group-hover:scale-105 transition-transform">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#123D2D]">Weather Disease Risk</h3>
              <p className="text-xs sm:text-sm text-[#66756A] mt-1.5 leading-relaxed">
                Understand micro-climatic humidity and temperature conditions that favor pathogen sporulation.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-[#1F3027] pt-2 border-t border-[#E0E6DC]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#347CB4]" />
                <span>48-Hour environmental risk suitability index</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#347CB4]" />
                <span>Calculated dew duration & canopy moisture</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                type="button"
                onClick={onViewWeatherRisk}
                className="text-xs font-bold text-[#347CB4] group-hover:text-[#123D2D] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Check Environmental Risk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Farmer Advisory */}
          <div className="rounded-3xl bg-white border border-[#E0E6DC] p-6 text-left shadow-sm hover:shadow-md transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#E5A52C] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#123D2D]">Farmer Advisory Center</h3>
              <p className="text-xs sm:text-sm text-[#66756A] mt-1.5 leading-relaxed">
                Know what to check and what to do next with actionable, gated agricultural guidance.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-[#1F3027] pt-2 border-t border-[#E0E6DC]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E5A52C]" />
                <span>Cultural practices & canopy airflow tips</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E5A52C]" />
                <span>Zero premature chemical spraying warnings</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                type="button"
                onClick={onEnterDashboard}
                className="text-xs font-bold text-[#E5A52C] group-hover:text-[#123D2D] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Review Farmer Advisories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. HOW IT WORKS SECTION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-3xl bg-white border border-[#E0E6DC] p-8 sm:p-12 text-left">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#287A4B]">
              SIMPLE WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123D2D] tracking-tight">
              How BhoomiSparsh Protects Your Farm
            </h2>
            <p className="text-xs sm:text-sm text-[#66756A]">
              Designed to be intuitive even for first-time smartphone users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#E9F1E6] text-[#123D2D] font-extrabold text-lg flex items-center justify-center border-2 border-[#6BA66B]/30 shadow-2xs">
                1
              </div>
              <h4 className="text-base font-bold text-[#123D2D]">Upload a Crop Photo</h4>
              <p className="text-xs text-[#66756A] max-w-xs leading-relaxed">
                Take a close-up photo of affected plant leaves or canopy using your smartphone camera.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#E9F1E6] text-[#123D2D] font-extrabold text-lg flex items-center justify-center border-2 border-[#6BA66B]/30 shadow-2xs">
                2
              </div>
              <h4 className="text-base font-bold text-[#123D2D]">Check Disease & Weather Risk</h4>
              <p className="text-xs text-[#66756A] max-w-xs leading-relaxed">
                Our model fuses leaf symptom patterns with local temperature and humidity forecasts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#E9F1E6] text-[#123D2D] font-extrabold text-lg flex items-center justify-center border-2 border-[#6BA66B]/30 shadow-2xs">
                3
              </div>
              <h4 className="text-base font-bold text-[#123D2D]">Follow Your Advisory</h4>
              <p className="text-xs text-[#66756A] max-w-xs leading-relaxed">
                Receive practical steps, watering adjustments, and inspection schedules without false alarms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. CLOSING CTA SECTION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-3xl bg-[#123D2D] text-white p-8 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Every healthy harvest starts with an early warning.
            </h2>
            <p className="text-sm sm:text-base text-[#E9F1E6]/90 leading-relaxed">
              Detect fungal and bacterial risks before crop damage occurs. Completely free and built for farmers.
            </p>
          </div>

          <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={onCheckCrop}
              className="bg-white text-[#123D2D] hover:bg-[#E9F1E6] font-extrabold rounded-2xl px-8 py-4 text-base shadow-md cursor-pointer border-0"
              rightIcon={<ArrowRight className="w-5 h-5 text-[#287A4B]" />}
            >
              Check My Crop
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onEnterDashboard}
              className="border-2 border-white/60 text-white hover:bg-white/10 font-bold rounded-2xl px-7 py-4 text-base cursor-pointer bg-transparent"
            >
              Enter Farmer Dashboard
            </Button>
          </div>

          {/* Background subtle leaf glow */}
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-[#287A4B]/20 pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#6BA66B]/15 pointer-events-none" />
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. PUBLIC FOOTER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <footer id="about" className="border-t border-[#E0E6DC] bg-white py-12 text-xs text-[#66756A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-[#123D2D] flex items-center justify-center text-[#E9F1E6]">
              <Sprout className="w-5 h-5 text-[#6BA66B]" />
            </div>
            <div>
              <span className="font-extrabold text-[#123D2D] text-base block">
                BhoomiSparsh
              </span>
              <p className="text-[11px] text-[#66756A]">
                Warn Early. Save Crops. • Indian AgriTech Initiative
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-[#1F3027]">
            <a href="#about" className="hover:text-[#287A4B] transition-colors">
              About
            </a>
            <a href="#how-it-works" className="hover:text-[#287A4B] transition-colors">
              How It Works
            </a>
            <span className="hover:text-[#287A4B] transition-colors cursor-pointer">
              Help & Support
            </span>
            <span className="hover:text-[#287A4B] transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-[#287A4B] transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-[#287A4B] transition-colors cursor-pointer">
              Contact
            </span>
          </div>

          <div className="text-[11px] text-[#66756A] font-medium">
            © 2026 BhoomiSparsh. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
