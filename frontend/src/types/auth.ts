export type UserRole = 'farmer' | 'extension_officer' | 'evaluator'

export interface FarmerProfile {
  id: string
  fullName: string
  phone: string
  district: string
  state: string
  farmName: string
  landSizeHectares: number
  primaryCrops: string[]
  role: UserRole
  farmerIdCode: string
  avatarUrl?: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: FarmerProfile | null
}

export interface OtpRequestResult {
  success: boolean
  message: string
  simulatedOtp?: string
}

export interface RegisterFarmerPayload {
  fullName: string
  phone: string
  district: string
  state: string
  farmName: string
  landSizeHectares: number
  primaryCrops: string[]
}
