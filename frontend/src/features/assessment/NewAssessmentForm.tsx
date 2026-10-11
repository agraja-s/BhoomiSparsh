import React, { useState, useRef } from 'react'
import {
  Camera,
  Upload,
  X,
  MapPin,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import type { Language } from '../../utils/translations'
import { translations } from '../../utils/translations'
import type { CropType, GrowthStage, AssessmentSubmissionPayload } from '../../types/assessment'

export interface NewAssessmentFormProps {
  language: Language
  onSubmit: (payload: AssessmentSubmissionPayload, previewUrl?: string) => Promise<void>
  isLoading: boolean
  onCancel: () => void
  initialData?: Partial<AssessmentSubmissionPayload>
}

const CROPS: CropType[] = [
  'Tomato',
  'Potato',
  'Rice',
  'Wheat',
  'Cotton',
  'Soybean',
  'Onion',
  'Chilli',
]

const GROWTH_STAGES: GrowthStage[] = [
  'Seedling',
  'Vegetative',
  'Flowering',
  'Fruiting',
  'Mature',
]

export const NewAssessmentForm: React.FC<NewAssessmentFormProps> = ({
  language,
  onSubmit,
  isLoading,
  onCancel,
  initialData,
}) => {
  const t = translations[language]

  // Form State
  const [cropType, setCropType] = useState<CropType | ''>(initialData?.cropType || 'Tomato')
  const [growthStage, setGrowthStage] = useState<GrowthStage | ''>(initialData?.growthStage || 'Fruiting')
  const [latitude, setLatitude] = useState<string>(
    initialData?.latitude ? String(initialData.latitude) : '18.5204'
  )
  const [longitude, setLongitude] = useState<string>(
    initialData?.longitude ? String(initialData.longitude) : '73.8567'
  )
  const [farmerNotes, setFarmerNotes] = useState<string>(initialData?.farmerNotes || '')

  // File Upload State
  const [imageFile, setImageFile] = useState<File | null>(initialData?.image || null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isFetchingLocation, setIsFetchingLocation] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelection = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: 'Please upload a JPEG, PNG, or WebP image.',
      }))
      return
    }

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: 'Image size exceeds 10MB limit. Please take a smaller photo.',
      }))
      return
    }

    setErrors((prev) => {
      const next = { ...prev }
      delete next.image
      return next
    })

    setImageFile(file)
    const preview = URL.createObjectURL(file)
    setImagePreview(preview)
  }

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({
        ...prev,
        location: 'Geolocation is not supported by your browser.',
      }))
      return
    }

    setIsFetchingLocation(true)
    setErrors((prev) => {
      const next = { ...prev }
      delete next.location
      return next
    })

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsFetchingLocation(false)
        setLatitude(pos.coords.latitude.toFixed(4))
        setLongitude(pos.coords.longitude.toFixed(4))
      },
      (err) => {
        setIsFetchingLocation(false)
        setErrors((prev) => ({
          ...prev,
          location: `Unable to retrieve location (${err.message}). Using manual coordinates.`,
        }))
      },
      { timeout: 8000, enableHighAccuracy: true }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!imageFile) {
      newErrors.image = t.validationImageRequired
    }
    if (!cropType) {
      newErrors.crop = t.validationCropRequired
    }
    if (!growthStage) {
      newErrors.growthStage = t.validationStageRequired
    }

    const latNum = parseFloat(latitude)
    const lngNum = parseFloat(longitude)
    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      newErrors.coordinates = t.validationCoordinatesRequired
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    await onSubmit(
      {
        image: imageFile!,
        cropType: cropType as CropType,
        growthStage: growthStage as GrowthStage,
        latitude: latNum,
        longitude: lngNum,
        farmerNotes: farmerNotes.trim() || undefined,
      },
      imagePreview || undefined
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      {/* Top back navigation */}
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#1B5E20] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.backToDashboard}</span>
      </button>

      <Card className="border-slate-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-slate-900">
            {t.fieldAssessmentTitle}
          </CardTitle>
          <CardDescription>{t.fieldAssessmentSubtitle}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload / Camera Capture */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">
                {t.uploadPhotoLabel} <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500">{t.uploadPhotoHelp}</p>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelection(file)
                }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelection(file)
                }}
              />

              {!imagePreview ? (
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 sm:p-8 text-center bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#1B5E20] flex items-center justify-center">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{t.dragOrClick}</p>
                      <p className="text-xs text-slate-500 mt-0.5">JPG, PNG, or WebP up to 10MB</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <Button
                        type="button"
                        variant="forest"
                        size="md"
                        onClick={() => cameraInputRef.current?.click()}
                        leftIcon={<Camera className="w-4 h-4" />}
                      >
                        Capture from Camera
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={() => fileInputRef.current?.click()}
                        leftIcon={<Upload className="w-4 h-4" />}
                      >
                        Upload from Device
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Uploaded crop leaf preview"
                    className="w-full max-h-72 object-contain bg-black/40"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                    >
                      {t.replacePhoto}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={handleRemoveImage}
                      leftIcon={<X className="w-3.5 h-3.5" />}
                    >
                      {t.removePhoto}
                    </Button>
                  </div>
                  <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Photo attached: {imageFile?.name} ({(imageFile!.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>
                </div>
              )}

              {errors.image && (
                <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.image}</span>
                </p>
              )}
            </div>

            {/* Crop Type & Growth Stage Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="crop-type-select" className="block text-xs sm:text-sm font-bold text-slate-800">
                  {t.cropTypeLabel} <span className="text-rose-500">*</span>
                </label>
                <select
                  id="crop-type-select"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value as CropType)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 min-h-[44px] focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 cursor-pointer"
                >
                  <option value="" disabled>
                    {t.selectCropPlaceholder}
                  </option>
                  {CROPS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.crop && <p className="text-xs text-rose-600 font-semibold">{errors.crop}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="growth-stage-select" className="block text-xs sm:text-sm font-bold text-slate-800">
                  {t.growthStageLabel} <span className="text-rose-500">*</span>
                </label>
                <select
                  id="growth-stage-select"
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value as GrowthStage)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 min-h-[44px] focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 cursor-pointer"
                >
                  <option value="" disabled>
                    {t.selectStagePlaceholder}
                  </option>
                  {GROWTH_STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.growthStage && (
                  <p className="text-xs text-rose-600 font-semibold">{errors.growthStage}</p>
                )}
              </div>
            </div>

            {/* Field Coordinates & GPS Autofill */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.fieldLocationLabel}</h4>
                  <p className="text-xs text-slate-500">
                    Required to query hyper-local micro-climate forecasts via Open-Meteo.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetCurrentLocation}
                  isLoading={isFetchingLocation}
                  leftIcon={<MapPin className="w-3.5 h-3.5 text-[#1B5E20]" />}
                  className="bg-white hover:bg-slate-50 text-[#1B5E20] font-semibold text-xs self-start sm:self-auto"
                >
                  {isFetchingLocation ? t.fetchingLocation : t.useCurrentLocation}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <Input
                  label={t.latitudeLabel}
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g. 18.5204"
                />
                <Input
                  label={t.longitudeLabel}
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g. 73.8567"
                />
              </div>

              {errors.coordinates && (
                <p className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.coordinates}</span>
                </p>
              )}
              {errors.location && (
                <p className="text-xs text-amber-700 font-medium">{errors.location}</p>
              )}
            </div>

            {/* Optional Farmer Observations */}
            <div className="space-y-1.5">
              <label htmlFor="farmer-notes" className="block text-xs sm:text-sm font-bold text-slate-800">
                {t.observationsLabel}
              </label>
              <textarea
                id="farmer-notes"
                rows={3}
                value={farmerNotes}
                onChange={(e) => setFarmerNotes(e.target.value)}
                placeholder={t.observationsPlaceholder}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
              />
            </div>

            {/* Submit Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                type="submit"
                variant="forest"
                size="lg"
                isLoading={isLoading}
                className="w-full sm:flex-1 py-4 text-base font-bold shadow-md rounded-2xl"
                leftIcon={<FileText className="w-5 h-5" />}
              >
                {isLoading ? t.analyzingButton : t.analyzeButton}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onCancel}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
