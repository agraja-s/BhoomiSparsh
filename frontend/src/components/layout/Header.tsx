import React from 'react'
import { ShieldCheck, Globe, Radio, Sparkles } from 'lucide-react'
import { Badge } from '../ui/Badge'
import type { Language } from '../../utils/translations'
import { translations } from '../../utils/translations'

export interface HeaderProps {
  isMockMode: boolean
  language: Language
  onLanguageChange: (lang: Language) => void
  onNavigateHome: () => void
}

export const Header: React.FC<HeaderProps> = ({
  isMockMode,
  language,
  onLanguageChange,
  onNavigateHome,
}) => {
  const t = translations[language]

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-xl p-1"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#1B5E20] flex items-center justify-center text-white shadow-sm group-hover:bg-[#2E7D32] transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#1B5E20] text-lg sm:text-xl tracking-tight">
                {t.appName}
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Early Warning
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              {t.appTagline}
            </p>
          </div>
        </button>

        {/* Right Controls: Language & Mode */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-[#F4F5F0] p-1 rounded-xl border border-slate-200">
            <Globe className="w-4 h-4 text-slate-500 ml-1.5 hidden sm:block" />
            {(['en', 'mr', 'hi'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  language === lang
                    ? 'bg-[#1B5E20] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                aria-pressed={language === lang}
              >
                {lang === 'en' ? 'EN' : lang === 'mr' ? 'मराठी' : 'हिंदी'}
              </button>
            ))}
          </div>

          {/* Mode Badge */}
          {isMockMode ? (
            <Badge variant="mock" dot className="px-3 py-1 text-[11px]">
              <Radio className="w-3 h-3 text-amber-600" />
              <span>{t.mockMode}</span>
            </Badge>
          ) : (
            <Badge variant="success" dot className="px-3 py-1 text-[11px]">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{t.liveMode}</span>
            </Badge>
          )}
        </div>
      </div>
    </header>
  )
}
