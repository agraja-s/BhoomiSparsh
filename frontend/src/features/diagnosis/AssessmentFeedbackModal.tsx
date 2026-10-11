import React, { useState } from 'react'
import {
  X,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Send,
  FileCheck,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { feedbackService } from '../../services/feedbackService'
import type {
  FeedbackLabelSource,
  FeedbackOutcomeStatus,
  AssessmentFeedbackResponse,
} from '../../types/assessment'
import type { Language } from '../../utils/translations'

export interface AssessmentFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  assessmentId: string
  cropType: string
  initialDisease?: string
  language: Language
  onSuccess?: (res: AssessmentFeedbackResponse) => void
}

export const AssessmentFeedbackModal: React.FC<AssessmentFeedbackModalProps> = ({
  isOpen,
  onClose,
  assessmentId,
  cropType,
  initialDisease,
  language,
  onSuccess,
}) => {
  const [labelSource, setLabelSource] = useState<FeedbackLabelSource>('farmer_report')
  const [diseaseObserved, setDiseaseObserved] = useState<'true' | 'false' | 'unknown'>('true')
  const [confirmedDisease, setConfirmedDisease] = useState(initialDisease || 'Late Blight')
  const [outcomeStatus, setOutcomeStatus] = useState<FeedbackOutcomeStatus>('improving')
  const [daysAfter, setDaysAfter] = useState<number>(7)
  const [advisoryHelpful, setAdvisoryHelpful] = useState<boolean>(true)
  const [notes, setNotes] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successResult, setSuccessResult] = useState<AssessmentFeedbackResponse | null>(null)

  if (!isOpen) return null

  // Trilingual translations
  const t = {
    en: {
      title: 'Assessment Feedback & Field Outcome',
      subtitle: 'Feed real-world field results into the AgriSentry AI learning loop.',
      sourceLabel: 'Verification Source / Reporter Role',
      farmerRole: 'Farmer Report (Standard)',
      expertRole: 'Agronomist / Officer Verified',
      observedRole: 'Field Observation',
      diseaseObservedLabel: 'Was disease observed upon field inspection?',
      yes: 'Yes, disease symptoms present',
      no: 'No, plant foliage is healthy',
      unknown: 'Uncertain / Needs recheck',
      confirmedDiseaseLabel: 'Confirmed Disease Name',
      outcomeLabel: 'Crop Progression Status',
      outcomeRecovered: 'Recovered',
      outcomeImproving: 'Improving',
      outcomeNoChange: 'No Change',
      outcomeWorsening: 'Worsening',
      outcomeSpread: 'Spread to neighboring plants',
      outcomeLoss: 'Severe Crop Loss',
      daysLabel: 'Days After Original Assessment',
      helpfulLabel: 'Was the early warning advisory practical & helpful?',
      notesLabel: 'Field Notes & Treatment Observations',
      notesPlaceholder: 'e.g. Applied recommended canopy pruning and ceased sprinkler irrigation...',
      submitBtn: 'Submit to Learning Loop',
      successTitle: 'Feedback Recorded Successfully!',
      successDesc: 'Observation has been synced with n8n and Supabase evaluation pipeline.',
    },
    hi: {
      title: 'फसल परिणाम एवं प्रतिक्रिया',
      subtitle: 'AgriSentry AI लर्निंग लूप के लिए वास्तविक परिणाम दर्ज करें।',
      sourceLabel: 'सत्यापन स्रोत / रिपोर्टर की भूमिका',
      farmerRole: 'किसान रिपोर्ट (सामान्य)',
      expertRole: 'कृषि विशेषज्ञ / अधिकारी द्वारा सत्यापित',
      observedRole: 'खेत निरीक्षण',
      diseaseObservedLabel: 'क्या निरीक्षण में बीमारी पाई गई?',
      yes: 'हाँ, लक्षण मौजूद हैं',
      no: 'नहीं, फसल पूरी तरह स्वस्थ है',
      unknown: 'अस्पष्ट / पुनः जांच आवश्यक',
      confirmedDiseaseLabel: 'पुष्ट बीमारी का नाम',
      outcomeLabel: 'फसल की वर्तमान स्थिति',
      outcomeRecovered: 'पूरी तरह ठीक',
      outcomeImproving: 'सुधार हो रहा है',
      outcomeNoChange: 'कोई बदलाव नहीं',
      outcomeWorsening: 'स्थिति बिगड़ रही है',
      outcomeSpread: 'अन्य पौधों में फैल रहा है',
      outcomeLoss: 'भारी नुकसान',
      daysLabel: 'मूल जांच के कितने दिन बाद',
      helpfulLabel: 'क्या चेतावनी सलाह उपयोगी रही?',
      notesLabel: 'खेत की स्थिति व उपचार नोट्स',
      notesPlaceholder: 'उदा. निचली पत्तियों की छंटाई की और फव्वारा सिंचाई बंद की...',
      submitBtn: 'लर्निंग लूप में भेजें',
      successTitle: 'परिणाम सफलतापूर्वक दर्ज हुआ!',
      successDesc: 'अवलोकन को n8n और Supabase मूल्यांकन पाइपलाइन से जोड़ा गया है।',
    },
    mr: {
      title: 'पीक परिणाम आणि शेतकरी अभिप्राय',
      subtitle: 'AgriSentry AI लर्निंग लूपसाठी शेतातील प्रत्यक्ष निरीक्षण नोंदवा.',
      sourceLabel: 'सत्यापन स्रोत / नोंदणीकर्त्याची भूमिका',
      farmerRole: 'शेतकरी नोंद (साधारण)',
      expertRole: 'कृषी अधिकारी / तज्ज्ञ पडताळणी',
      observedRole: 'शेत निरीक्षण',
      diseaseObservedLabel: 'शेतात प्रत्यक्षात रोग आढळून आला का?',
      yes: 'होय, रोगाची लक्षणे आढळली',
      no: 'नाही, पीक निरोगी आहे',
      unknown: 'अस्पष्ट / फेरतपासणी आवश्यक',
      confirmedDiseaseLabel: 'निश्चित झालेल्या रोगाचे नाव',
      outcomeLabel: 'पिकाची सध्याची प्रगती',
      outcomeRecovered: 'पूर्णपणे बरे झाले',
      outcomeImproving: 'सुधारणा होत आहे',
      outcomeNoChange: 'काही फरक नाही',
      outcomeWorsening: 'रोग वाढत आहे',
      outcomeSpread: 'इतर रोपांवर पसरला',
      outcomeLoss: 'पिकाचे नुकसान झाले',
      daysLabel: 'तपासणीनंतरचे दिवस',
      helpfulLabel: 'मिळालेला सल्ला उपयुक्त ठरला का?',
      notesLabel: 'शेतातील उपाययोजना व निरीक्षणे',
      notesPlaceholder: 'उदा. खराब पाने छाटून घेतली आणि ठिबक सिंचन सुरू केले...',
      submitBtn: 'लर्निंग लूपमध्ये नोंदवा',
      successTitle: 'अभिप्राय यशस्वीरीत्या नोंदवला गेला!',
      successDesc: 'निरीक्षण n8n आणि Supabase मूल्यमापन यंत्रणेमध्ये जोडले गेले आहे.',
    },
  }[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await feedbackService.submitFeedback({
        assessmentId,
        labelSource,
        diseaseObserved: diseaseObserved === 'true' ? true : diseaseObserved === 'false' ? false : 'unknown',
        outcomeStatus,
        daysAfterAssessment: daysAfter,
        farmerFoundAdvisoryHelpful: advisoryHelpful,
        observedCropType: cropType,
        confirmedDisease: diseaseObserved === 'true' ? confirmedDisease : undefined,
        notes: notes.trim() || undefined,
      })

      setSuccessResult(res)
      if (onSuccess) onSuccess(res)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Could not submit feedback.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E0E6DC] shadow-2xl overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-[#123D2D] text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#6BA66B] border border-white/20 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  {t.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6BA66B]/20 text-[#6BA66B] border border-[#6BA66B]/30">
                  n8n Connected
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                {t.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {successResult ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[#123D2D]">
                  {t.successTitle}
                </h4>
                <p className="text-xs text-[#66756A] max-w-sm mx-auto mt-1">
                  {t.successDesc}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#F8F7EF] border border-[#E0E6DC] text-left text-[11px] space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#66756A]">Feedback ID:</span>
                  <span className="font-mono font-bold text-[#123D2D]">{successResult.feedbackId.slice(0, 18)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#66756A]">Evaluation Eligible:</span>
                  <Badge variant={successResult.evaluationEligible ? 'success' : 'mock'} className="text-[10px] py-0">
                    {successResult.evaluationEligible ? 'Verified for Metrics' : 'Farmer Qualitative'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#66756A]">Verification Status:</span>
                  <span className="font-semibold text-[#123D2D]">{successResult.verificationStatus || 'Recorded'}</span>
                </div>
              </div>

              <Button
                size="md"
                onClick={onClose}
                className="bg-[#123D2D] hover:bg-[#287A4B] text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Assessment Context Banner */}
              <div className="p-3 rounded-2xl bg-[#E9F1E6] border border-[#287A4B]/20 text-[#123D2D] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#287A4B] block">
                    Assessment Reference
                  </span>
                  <span className="font-mono text-xs font-bold">{assessmentId.slice(0, 18)}...</span>
                </div>
                <Badge variant="forest" className="text-[10px]">
                  {cropType}
                </Badge>
              </div>

              {/* 1. Reporter Role */}
              <div>
                <label className="block font-bold text-[#1F3027] mb-1.5">
                  {t.sourceLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'farmer_report', label: t.farmerRole },
                    { id: 'expert_verified', label: t.expertRole },
                    { id: 'field_observed', label: t.observedRole },
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setLabelSource(role.id as FeedbackLabelSource)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold leading-tight text-[11px] ${
                        labelSource === role.id
                          ? 'border-[#287A4B] bg-[#E9F1E6] text-[#123D2D]'
                          : 'border-[#E0E6DC] bg-white text-[#66756A] hover:border-[#287A4B]/50'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Disease Observed */}
              <div>
                <label className="block font-bold text-[#1F3027] mb-1.5">
                  {t.diseaseObservedLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'true', label: t.yes, color: 'text-amber-700' },
                    { id: 'false', label: t.no, color: 'text-emerald-700' },
                    { id: 'unknown', label: t.unknown, color: 'text-slate-600' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDiseaseObserved(opt.id as 'true' | 'false' | 'unknown')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold text-[11px] ${
                        diseaseObserved === opt.id
                          ? 'border-[#287A4B] bg-[#E9F1E6] text-[#123D2D]'
                          : 'border-[#E0E6DC] bg-white text-[#66756A]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Confirmed Disease Name (if true) */}
              {diseaseObserved === 'true' && (
                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    {t.confirmedDiseaseLabel} *
                  </label>
                  <input
                    type="text"
                    value={confirmedDisease}
                    onChange={(e) => setConfirmedDisease(e.target.value)}
                    placeholder="e.g. Late Blight"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E6DC] text-xs font-semibold text-[#1F3027] outline-none focus:border-[#287A4B]"
                    required
                  />
                </div>
              )}

              {/* 4. Crop Outcome Status */}
              <div>
                <label className="block font-bold text-[#1F3027] mb-1.5">
                  {t.outcomeLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'recovered', label: t.outcomeRecovered },
                    { id: 'improving', label: t.outcomeImproving },
                    { id: 'no_change', label: t.outcomeNoChange },
                    { id: 'worsening', label: t.outcomeWorsening },
                    { id: 'spread_to_other_plants', label: t.outcomeSpread },
                    { id: 'crop_loss', label: t.outcomeLoss },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setOutcomeStatus(st.id as FeedbackOutcomeStatus)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer font-bold text-[11px] ${
                        outcomeStatus === st.id
                          ? 'border-[#287A4B] bg-[#E9F1E6] text-[#123D2D]'
                          : 'border-[#E0E6DC] bg-white text-[#66756A]'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Days After Assessment & Advisory Helpfulness */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    {t.daysLabel}
                  </label>
                  <select
                    value={daysAfter}
                    onChange={(e) => setDaysAfter(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E0E6DC] bg-white text-xs font-semibold outline-none focus:border-[#287A4B]"
                  >
                    <option value={1}>1 Day</option>
                    <option value={3}>3 Days</option>
                    <option value={7}>7 Days (1 Week)</option>
                    <option value={14}>14 Days (2 Weeks)</option>
                    <option value={30}>30 Days (1 Month)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    {t.helpfulLabel}
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAdvisoryHelpful(true)}
                      className={`flex-1 py-2 rounded-xl border font-bold transition-colors cursor-pointer text-xs ${
                        advisoryHelpful
                          ? 'border-[#287A4B] bg-[#E9F1E6] text-[#123D2D]'
                          : 'border-[#E0E6DC] text-[#66756A]'
                      }`}
                    >
                      👍 Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdvisoryHelpful(false)}
                      className={`flex-1 py-2 rounded-xl border font-bold transition-colors cursor-pointer text-xs ${
                        !advisoryHelpful
                          ? 'border-rose-400 bg-rose-50 text-rose-800'
                          : 'border-[#E0E6DC] text-[#66756A]'
                      }`}
                    >
                      👎 No
                    </button>
                  </div>
                </div>
              </div>

              {/* 6. Notes */}
              <div>
                <label className="block font-bold text-[#1F3027] mb-1">
                  {t.notesLabel}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.notesPlaceholder}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E0E6DC] text-xs outline-none focus:border-[#287A4B]"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#123D2D] hover:bg-[#287A4B] text-white font-bold py-3 rounded-xl cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transmitting to n8n Webhook...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    <span>{t.submitBtn}</span>
                  </span>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#E0E6DC] bg-[#F8F7EF] flex items-center justify-between text-xs text-[#66756A] shrink-0">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#287A4B]" />
            Workflow: AgriSentry — Assessment Feedback & Outcomes
          </span>
          <span className="text-[11px] font-mono font-bold text-[#287A4B]">
            POST /api/v1/assessment-feedback
          </span>
        </div>
      </div>
    </div>
  )
}
