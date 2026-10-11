import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import type { Language } from '../../utils/translations'

export interface LayoutProps {
  children: React.ReactNode
  isMockMode: boolean
  apiBaseUrl: string
  language: Language
  onLanguageChange: (lang: Language) => void
  onNavigateHome: () => void
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  isMockMode,
  apiBaseUrl,
  language,
  onLanguageChange,
  onNavigateHome,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-slate-900 font-sans antialiased">
      <Header
        isMockMode={isMockMode}
        language={language}
        onLanguageChange={onLanguageChange}
        onNavigateHome={onNavigateHome}
      />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
      <Footer apiBaseUrl={apiBaseUrl} isMockMode={isMockMode} />
    </div>
  )
}
