import React from 'react'
import { Server, ShieldCheck, Sprout } from 'lucide-react'

export interface FooterProps {
  apiBaseUrl: string
  isMockMode: boolean
}

export const Footer: React.FC<FooterProps> = ({ apiBaseUrl, isMockMode }) => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700">
          <Sprout className="w-4 h-4 text-[#1B5E20]" />
          <span className="font-semibold text-slate-800">AgriSentry</span>
          <span>• Inspired by Bhumisparsh agricultural design</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <span>Backend:</span>
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
              {apiBaseUrl}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open-Meteo & ICAR Verified Guidelines</span>
          </div>

          {isMockMode && (
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium border border-amber-200">
              DEMO DATA MODE ACTIVE
            </span>
          )}
        </div>
      </div>
    </footer>
  )
}
