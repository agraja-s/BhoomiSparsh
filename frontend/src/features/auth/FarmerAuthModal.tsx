import React, { useState, useEffect } from 'react'
import {
  Sprout,
  X,
  ShieldCheck,
  User,
  RefreshCw,
  AlertTriangle,
  Lock,
  Mail,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { authService } from '../../services/authService'
import type { FarmerProfile } from '../../types/auth'
import type { Language } from '../../utils/translations'

export interface FarmerAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: FarmerProfile) => void
  language: Language
  initialTab?: 'login' | 'register'
}

type AuthTab = 'login' | 'register'

export const FarmerAuthModal: React.FC<FarmerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language,
  initialTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab)

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab)
    }
  }, [isOpen, initialTab])

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Registration Form State
  const [regName, setRegName] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regDistrict, setRegDistrict] = useState('Pune District')
  const [regState, setRegState] = useState('Maharashtra')
  const [regFarmName, setRegFarmName] = useState('Kisan Krishi Farm')
  const [regLandSize, setRegLandSize] = useState('2.0')
  const [regCrops, setRegCrops] = useState<string[]>(['Tomato', 'Potato'])

  if (!isOpen) return null

  // Trilingual labels (no mention of Supabase)
  const t = {
    en: {
      title: 'Farmer Portal',
      subtitle: 'Sign in or sign up to access crop diagnosis and weather advisories.',
      tabLogin: 'Log In',
      tabRegister: 'Sign Up',
      loginIdLabel: 'Mobile Number or Email',
      loginIdPlaceholder: 'e.g. 9822041209 or farmer@domain.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      loginBtn: 'Log In',
      loginTip: 'Enter your registered mobile number or email and password to continue.',
      noAccount: "Don't have an account?",
      goToRegister: 'Sign Up here',
      alreadyAccount: 'Already have an account?',
      goToLogin: 'Log In here',
      regNameLabel: 'Full Name',
      regPhoneLabel: 'Mobile Number or Email',
      regPassLabel: 'Password (min 6 characters)',
      regDistrictLabel: 'District',
      regStateLabel: 'State',
      regFarmLabel: 'Farm / Plot Name',
      regLandLabel: 'Land Size (Hectares)',
      registerBtn: 'Create Account & Sign In',
      secureNote: 'Secure Farmer Portal • BhoomiSparsh',
    },
    hi: {
      title: 'किसान पोर्टल',
      subtitle: 'फसल निदान और मौसम सलाह के लिए लॉगिन या साइन अप करें।',
      tabLogin: 'लॉगिन',
      tabRegister: 'साइन अप',
      loginIdLabel: 'मोबाइल नंबर या ईमेल',
      loginIdPlaceholder: 'उदा. 9822041209 या farmer@domain.com',
      passwordLabel: 'पासवर्ड',
      passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
      loginBtn: 'लॉगिन करें',
      loginTip: 'आगे बढ़ने के लिए अपना पंजीकृत मोबाइल नंबर या ईमेल और पासवर्ड दर्ज करें।',
      noAccount: 'क्या आपके पास खाता नहीं है?',
      goToRegister: 'यहाँ साइन अप करें',
      alreadyAccount: 'पहले से खाता है?',
      goToLogin: 'यहाँ लॉगिन करें',
      regNameLabel: 'किसान का पूरा नाम',
      regPhoneLabel: 'मोबाइल नंबर या ईमेल',
      regPassLabel: 'पासवर्ड (कम से कम 6 अक्षर)',
      regDistrictLabel: 'जिला',
      regStateLabel: 'राज्य',
      regFarmLabel: 'खेत / प्लॉट का नाम',
      regLandLabel: 'जमीन का क्षेत्रफल (हेक्टेयर)',
      registerBtn: 'खाता बनाएं और लॉगिन करें',
      secureNote: 'सुरक्षित किसान पोर्टल • भूमिस्पर्श',
    },
    mr: {
      title: 'शेतकरी पोर्टल',
      subtitle: 'पीक रोग निदान आणि हवामान सल्ल्यासाठी लॉगिन किंवा नोंदणी करा.',
      tabLogin: 'लॉगिन',
      tabRegister: 'साइन अप (नोंदणी)',
      loginIdLabel: 'मोबाईल नंबर किंवा ईमेल',
      loginIdPlaceholder: 'उदा. ९८२२०४१२०९ किंवा farmer@domain.com',
      passwordLabel: 'पासवर्ड',
      passwordPlaceholder: 'तुमचा पासवर्ड टाका',
      loginBtn: 'लॉगिन करा',
      loginTip: 'पुढे जाण्यासाठी तुमचा नोंदणीकृत मोबाईल किंवा ईमेल आणि पासवर्ड टाका.',
      noAccount: 'खाते नाही का?',
      goToRegister: 'येथे साइन अप करा',
      alreadyAccount: 'आधीच खाते आहे का?',
      goToLogin: 'येथे लॉगिन करा',
      regNameLabel: 'शेतकऱ्याचे पूर्ण नाव',
      regPhoneLabel: 'मोबाईल नंबर किंवा ईमेल',
      regPassLabel: 'पासवर्ड (किमान ६ अक्षरे)',
      regDistrictLabel: 'जिल्हा',
      regStateLabel: 'राज्य',
      regFarmLabel: 'शेताचे नाव',
      regLandLabel: 'जमीन क्षेत्र (हेक्टर)',
      registerBtn: 'खाते तयार करा आणि लॉगिन करा',
      secureNote: 'सुरक्षित शेतकरी पोर्टल • भूमीस्पर्श',
    },
  }[language]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage('Please provide your mobile number/email and password.')
      return
    }
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const user = await authService.loginWithSupabase(loginIdentifier, loginPassword)
      setSuccessMessage('Logged in successfully!')
      setTimeout(() => {
        onSuccess(user)
        onClose()
      }, 400)
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Invalid credentials. Please check your password.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!regName.trim() || !regPhone.trim()) {
      setErrorMessage('Please provide farmer name and mobile contact.')
      return
    }
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const user = await authService.signUpWithSupabase({
        fullName: regName,
        phone: regPhone,
        password: regPassword || 'Kisan@123456',
        district: regDistrict,
        state: regState,
        farmName: regFarmName,
        landSizeHectares: parseFloat(regLandSize) || 2.0,
        primaryCrops: regCrops,
      })
      setSuccessMessage('Account created successfully!')
      setTimeout(() => {
        onSuccess(user)
        onClose()
      }, 500)
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCrop = (crop: string) => {
    setRegCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E0E6DC] shadow-2xl overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-[#123D2D] text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-[#6BA66B] border border-white/20 shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                {t.title}
              </h2>
              <p className="text-xs text-white/75 mt-0.5 leading-snug">
                {t.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean 2-Option Switcher: Login and Sign Up */}
        <div className="flex border-b border-[#E0E6DC] bg-[#F8F7EF] p-1.5 text-xs font-bold gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login')
              setErrorMessage(null)
              setSuccessMessage(null)
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'bg-white text-[#123D2D] shadow-xs border border-[#E0E6DC]'
                : 'text-[#66756A] hover:text-[#123D2D]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#287A4B]" />
            <span>{t.tabLogin}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register')
              setErrorMessage(null)
              setSuccessMessage(null)
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-white text-[#123D2D] shadow-xs border border-[#E0E6DC]'
                : 'text-[#66756A] hover:text-[#123D2D]'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#287A4B]" />
            <span>{t.tabRegister}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Error / Success Messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-bold text-[#1F3027] mb-1.5">
                  {t.loginIdLabel} *
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66756A]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={t.loginIdPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E6DC] bg-white text-xs text-[#1F3027] outline-none font-medium focus:border-[#287A4B]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1F3027] mb-1.5">
                  {t.passwordLabel} *
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#66756A]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E6DC] bg-white text-xs text-[#1F3027] outline-none font-medium focus:border-[#287A4B]"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#E9F1E6]/70 border border-[#287A4B]/20 text-[11px] text-[#123D2D] leading-relaxed">
                💡 {t.loginTip}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#123D2D] hover:bg-[#287A4B] text-white font-bold py-3 rounded-xl cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Logging in...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>{t.loginBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              {/* 1-Tap Quick Demo Fill */}
              <div className="pt-2 border-t border-[#E0E6DC]">
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('9822041209')
                    setLoginPassword('Kisan@123')
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#E9F1E6] hover:bg-[#d8e6d3] text-[#123D2D] font-bold text-[11px] text-center transition-colors cursor-pointer border border-[#287A4B]/30 flex items-center justify-center gap-1.5"
                >
                  <span>⚡ 1-Tap Demo Fill: 98220 41209 / Kisan@123</span>
                </button>
              </div>

              {/* Quick switch to register */}
              <div className="text-center pt-2 text-[#66756A]">
                <span>{t.noAccount} </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register')
                    setErrorMessage(null)
                  }}
                  className="text-[#287A4B] font-bold hover:underline cursor-pointer ml-1"
                >
                  {t.goToRegister}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block font-bold text-[#1F3027] mb-1">
                  {t.regNameLabel} *
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E6DC] text-xs outline-none focus:border-[#287A4B]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#1F3027] mb-1">
                  {t.regPhoneLabel} *
                </label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="e.g. 9822041209 or name@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E6DC] text-xs outline-none focus:border-[#287A4B]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#1F3027] mb-1">
                  {t.regPassLabel} *
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E6DC] text-xs outline-none focus:border-[#287A4B]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    {t.regDistrictLabel}
                  </label>
                  <input
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E0E6DC] text-xs outline-none focus:border-[#287A4B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    {t.regStateLabel}
                  </label>
                  <select
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E0E6DC] bg-white text-xs outline-none focus:border-[#287A4B]"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    {t.regFarmLabel}
                  </label>
                  <input
                    type="text"
                    value={regFarmName}
                    onChange={(e) => setRegFarmName(e.target.value)}
                    placeholder="e.g. Kisan Farm"
                    className="w-full px-3 py-2 rounded-xl border border-[#E0E6DC] text-xs outline-none focus:border-[#287A4B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1F3027] mb-1">
                    {t.regLandLabel}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={regLandSize}
                    onChange={(e) => setRegLandSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E0E6DC] text-xs outline-none focus:border-[#287A4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1F3027] mb-1">
                  Primary Crops
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Potato', 'Tomato', 'Rice', 'Wheat', 'Cotton', 'Onion', 'Chilli'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCrop(c)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                        regCrops.includes(c)
                          ? 'bg-[#287A4B] text-white border-[#287A4B]'
                          : 'bg-[#F8F7EF] text-[#66756A] border-[#E0E6DC]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#123D2D] hover:bg-[#287A4B] text-white font-bold py-3 rounded-xl mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>{t.registerBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              {/* Quick switch to login */}
              <div className="text-center pt-2 text-[#66756A]">
                <span>{t.alreadyAccount} </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login')
                    setErrorMessage(null)
                  }}
                  className="text-[#287A4B] font-bold hover:underline cursor-pointer ml-1"
                >
                  {t.goToLogin}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Clean Footer */}
        <div className="p-4 border-t border-[#E0E6DC] bg-[#F8F7EF] flex items-center justify-center text-xs text-[#66756A] shrink-0">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#287A4B]" />
            {t.secureNote}
          </span>
        </div>
      </div>
    </div>
  )
}
