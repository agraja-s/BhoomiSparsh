import React from 'react'
import {
  Camera,
  CloudSun,
  TrendingUp,
  ArrowRight,
  Calendar,
  MapPin,
  Leaf,
  Info,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import type { Language } from '../../utils/translations'
import { translations } from '../../utils/translations'
import type { AssessmentResponse } from '../../types/assessment'

export interface FarmerDashboardProps {
  language: Language
  onStartNewAssessment: () => void
  onSelectAssessment: (assessment: AssessmentResponse) => void
  recentAssessments: AssessmentResponse[]
  isMockMode: boolean
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  language,
  onStartNewAssessment,
  onSelectAssessment,
  recentAssessments,
  isMockMode,
}) => {
  const t = translations[language]

  return (
    <div className="space-y-8 text-left">
      {/* Mock Notice Banner */}
      {isMockMode && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-medium">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{t.mockNotice}</span>
        </div>
      )}

      {/* Hero Action Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white p-6 sm:p-10 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-emerald-100 text-xs font-semibold">
            <Leaf className="w-3.5 h-3.5 text-emerald-300" />
            <span>Early Warning • Proactive Prevention</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Protect Your Harvest Before Symptoms Spread
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl">
            Farmers often detect crop disease only after visible damage has set in. AgriSentry combines your leaf photo with hyper-local weather forecasts to predict disease risk 48 hours in advance.
          </p>

          <div className="pt-2">
            <Button
              size="lg"
              variant="secondary"
              onClick={onStartNewAssessment}
              className="bg-white text-[#1B5E20] hover:bg-emerald-50 hover:text-[#1B5E20] shadow-md border-0 text-base font-bold px-6 py-4 rounded-2xl"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {t.startAssessment}
            </Button>
          </div>
        </div>

        {/* Subtle decorative background ring */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* 3-Step Plain Language Explanation */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {t.howItWorksTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1B5E20] flex items-center justify-center mb-2">
                <Camera className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">{t.step1Title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.step1Desc}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2">
                <CloudSun className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">{t.step2Title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.step2Desc}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5" />
              </div>
              <CardTitle className="text-base">{t.step3Title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.step3Desc}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Field Assessments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {t.recentAssessments}
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={onStartNewAssessment}
            className="text-xs font-semibold rounded-xl"
          >
            + {t.fieldAssessmentTitle}
          </Button>
        </div>

        {recentAssessments.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 border-dashed">
            <p className="text-sm">{t.noRecentAssessments}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentAssessments.map((item) => {
              const riskVariant =
                item.riskAssessment.overallRiskLevel === 'high'
                  ? 'risk-high'
                  : item.riskAssessment.overallRiskLevel === 'moderate'
                  ? 'risk-moderate'
                  : 'risk-low'

              return (
                <Card
                  key={item.assessmentId}
                  className="hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => onSelectAssessment(item)}
                >
                  <CardHeader className="pb-3 border-b-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B5E20]">
                          <Leaf className="w-3.5 h-3.5" />
                          <span>{item.diagnosis.cropIdentified}</span>
                          <span className="text-slate-400 font-normal">
                            ({item.diagnosis.cropGrowthStage})
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-base mt-1 group-hover:text-[#1B5E20] transition-colors">
                          {item.diagnosis.primaryCandidate?.name || 'Inspection Record'}
                        </h4>
                      </div>
                      <Badge variant={riskVariant} dot>
                        {item.riskAssessment.overallRiskLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.location.district || 'Field Coordinates'}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(item.generatedAt).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 line-clamp-2">
                      {item.advisory.headline}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-mono text-slate-400">
                        Index: {item.riskAssessment.riskIndex}/100
                      </span>
                      <span className="text-xs font-bold text-[#1B5E20] group-hover:underline flex items-center gap-1">
                        <span>View Assessment</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
