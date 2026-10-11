import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type {
  FarmerProfile,
  OtpRequestResult,
  RegisterFarmerPayload,
} from '../types/auth'

const STORAGE_KEY = 'agrisentry_auth_user'
const REGISTERED_KEY = 'agrisentry_registered_accounts'

export const DEMO_FARMERS: FarmerProfile[] = [
  {
    id: 'farmer-ramesh',
    fullName: 'Ramesh Patil',
    phone: '+91 98220 41209',
    district: 'Pune District',
    state: 'Maharashtra',
    farmName: 'Green Valley Farm',
    landSizeHectares: 2.5,
    primaryCrops: ['Potato', 'Tomato', 'Cotton'],
    role: 'farmer',
    farmerIdCode: '#MH-PUN-8419',
    avatarUrl: '/farmer_avatar.jpg',
  },
  {
    id: 'farmer-sunita',
    fullName: 'Sunita Shinde',
    phone: '+91 94231 88720',
    district: 'Nashik District',
    state: 'Maharashtra',
    farmName: 'Godavari Horticulture',
    landSizeHectares: 3.8,
    primaryCrops: ['Onion', 'Tomato', 'Soybean'],
    role: 'farmer',
    farmerIdCode: '#MH-NSK-3210',
    avatarUrl: '/farmer_avatar.jpg',
  },
  {
    id: 'farmer-harpreet',
    fullName: 'Harpreet Singh',
    phone: '+91 98765 21098',
    district: 'Ludhiana District',
    state: 'Punjab',
    farmName: 'Kisan Golden Acre',
    landSizeHectares: 5.0,
    primaryCrops: ['Wheat', 'Rice'],
    role: 'farmer',
    farmerIdCode: '#PB-LDH-9041',
    avatarUrl: '/farmer_avatar.jpg',
  },
  {
    id: 'officer-anjali',
    fullName: 'Dr. Anjali Deshmukh',
    phone: '+91 98200 11223',
    district: 'Pune Division',
    state: 'Maharashtra',
    farmName: 'District KVK Extension Center',
    landSizeHectares: 10.0,
    primaryCrops: ['Potato', 'Rice', 'Wheat', 'Chilli'],
    role: 'extension_officer',
    farmerIdCode: '#AGRI-OFFICER-01',
    avatarUrl: '/farmer_avatar.jpg',
  },
]

export class AuthService {
  private currentUser: FarmerProfile | null = null

  constructor() {
    this.currentUser = this.loadFromStorage()
    this.initSupabaseListener()
  }

  private initSupabaseListener(): void {
    if (!supabase) return
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = this.userToFarmerProfile(session.user)
        this.currentUser = profile
        this.saveToStorage(profile)
      }
    })
  }

  private userToFarmerProfile(user: import('@supabase/supabase-js').User): FarmerProfile {
    const meta = user.user_metadata || {}
    const phone = meta.phone || user.phone || '+91 98220 41209'
    const code =
      meta.farmer_id_code ||
      `#MH-${(user.id || '').slice(0, 4).toUpperCase()}`

    return {
      id: user.id,
      fullName: meta.full_name || meta.name || user.email?.split('@')[0] || 'Farmer Member',
      phone,
      district: meta.district || 'Pune District',
      state: meta.state || 'Maharashtra',
      farmName: meta.farm_name || 'Kisan Agricultural Plot',
      landSizeHectares: Number(meta.land_size_hectares) || 2.0,
      primaryCrops: Array.isArray(meta.primary_crops)
        ? meta.primary_crops
        : ['Tomato', 'Potato'],
      role: meta.role === 'extension_officer' ? 'extension_officer' : 'farmer',
      farmerIdCode: code,
      avatarUrl: meta.avatar_url || '/farmer_avatar.jpg',
    }
  }

  private loadFromStorage(): FarmerProfile | null {
    try {
      if (typeof window === 'undefined') return null
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as FarmerProfile
      }
    } catch {
      // Storage unavailable
    }
    return null
  }

  private saveToStorage(user: FarmerProfile | null): void {
    try {
      if (typeof window === 'undefined') return
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // Ignore
    }
  }

  public getCurrentUser(): FarmerProfile | null {
    return this.currentUser
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  public isUsingSupabase(): boolean {
    return isSupabaseConfigured && supabase !== null
  }

  private saveRegisteredFarmer(
    email: string,
    phone: string,
    password: string,
    profile: FarmerProfile
  ): void {
    try {
      if (typeof window === 'undefined') return
      const raw = localStorage.getItem(REGISTERED_KEY)
      const list = raw ? JSON.parse(raw) : []
      list.push({
        email: email.toLowerCase(),
        phone: phone.replace(/\D/g, ''),
        password,
        profile,
      })
      localStorage.setItem(REGISTERED_KEY, JSON.stringify(list))
    } catch {
      // Ignore
    }
  }

  private findRegisteredFarmer(emailOrPhone: string): FarmerProfile | null {
    try {
      if (typeof window === 'undefined') return null
      const raw = localStorage.getItem(REGISTERED_KEY)
      if (!raw) return null
      const list: Array<{ email: string; phone: string; profile: FarmerProfile }> = JSON.parse(raw)
      const cleaned = emailOrPhone.trim().toLowerCase()
      const digits = cleaned.replace(/\D/g, '')

      const found = list.find((item) => {
        if (item.email === cleaned) return true
        if (digits && item.phone.includes(digits.slice(-10))) return true
        return false
      })
      return found ? found.profile : null
    } catch {
      return null
    }
  }

  public async loginWithSupabase(
    emailOrPhone: string,
    password: string
  ): Promise<FarmerProfile> {
    const cleaned = emailOrPhone.trim()
    const email = cleaned.includes('@')
      ? cleaned
      : `farmer.${cleaned.replace(/\D/g, '')}@agrisentry.org`

    // 1. Try Supabase Cloud Login first
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (!error && data.user) {
          const profile = this.userToFarmerProfile(data.user)
          this.currentUser = profile
          this.saveToStorage(profile)
          return profile
        }
      } catch (err) {
        console.warn('Supabase cloud login attempt notice:', err)
      }
    }

    // 2. Check local registered farmer accounts cache
    const localMatch = this.findRegisteredFarmer(emailOrPhone)
    if (localMatch) {
      this.currentUser = localMatch
      this.saveToStorage(localMatch)
      return localMatch
    }

    // 3. Check demo farmers list (Ramesh Patil, Sunita Shinde, Harpreet Singh)
    const demoMatch = DEMO_FARMERS.find(
      (f) =>
        f.phone.replace(/\D/g, '').includes(cleaned.replace(/\D/g, '')) ||
        f.fullName.toLowerCase().includes(cleaned.toLowerCase()) ||
        f.id.toLowerCase() === cleaned.toLowerCase()
    )
    if (demoMatch) {
      this.currentUser = demoMatch
      this.saveToStorage(demoMatch)
      return demoMatch
    }

    // 4. If mobile number has at least 10 digits or email format
    const digits = cleaned.replace(/\D/g, '')
    if (digits.length >= 10 || cleaned.includes('@')) {
      const quickProfile: FarmerProfile = {
        id: `farmer-${digits || Date.now().toString(36)}`,
        fullName: digits.length >= 10 ? `Kisan (+91 ${digits.slice(-10)})` : cleaned.split('@')[0],
        phone: digits.length >= 10 ? `+91 ${digits.slice(-10)}` : '+91 98220 41209',
        district: 'Pune District',
        state: 'Maharashtra',
        farmName: 'Registered Farm Plot',
        landSizeHectares: 2.0,
        primaryCrops: ['Tomato', 'Potato'],
        role: 'farmer',
        farmerIdCode: `#MH-${Math.floor(1000 + Math.random() * 9000)}`,
        avatarUrl: '/farmer_avatar.jpg',
      }
      this.saveRegisteredFarmer(email, cleaned, password, quickProfile)
      this.currentUser = quickProfile
      this.saveToStorage(quickProfile)
      return quickProfile
    }

    throw new Error('Please enter a valid 10-digit mobile number or email and password.')
  }

  public async signUpWithSupabase(
    payload: RegisterFarmerPayload & { password?: string; email?: string }
  ): Promise<FarmerProfile> {
    const isEmail = payload.phone.includes('@')
    const phoneDigits = payload.phone.replace(/\D/g, '')
    const email =
      payload.email ||
      (isEmail ? payload.phone.trim() : `farmer.${phoneDigits || Date.now()}@agrisentry.org`)
    const password = payload.password || 'Kisan@123456'
    const code = `#${payload.state.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`

    const metadata = {
      full_name: payload.fullName,
      phone: payload.phone,
      district: payload.district,
      state: payload.state,
      farm_name: payload.farmName || 'Kisan Agricultural Plot',
      land_size_hectares: payload.landSizeHectares || 2.0,
      primary_crops: payload.primaryCrops.length > 0 ? payload.primaryCrops : ['Tomato', 'Potato'],
      role: 'farmer',
      farmer_id_code: code,
    }

    let createdUser: FarmerProfile | null = null

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata,
          },
        })

        if (!error && data.user) {
          createdUser = this.userToFarmerProfile(data.user)
          // Attempt to write into public.profiles if table exists
          try {
            await supabase.from('profiles').insert([
              {
                id: data.user.id,
                ...metadata,
              },
            ])
          } catch {
            // Table may not exist yet
          }
        } else if (error) {
          console.warn('Supabase cloud signup notice (falling back gracefully):', error.message)
        }
      } catch (err) {
        console.warn('Supabase signup network notice:', err)
      }
    }

    if (!createdUser) {
      // Local fallback farmer profile
      createdUser = {
        id: `farmer-${Date.now().toString(36)}`,
        fullName: payload.fullName,
        phone: payload.phone,
        district: payload.district,
        state: payload.state,
        farmName: payload.farmName || 'Kisan Agricultural Plot',
        landSizeHectares: payload.landSizeHectares || 2.0,
        primaryCrops: payload.primaryCrops.length > 0 ? payload.primaryCrops : ['Tomato', 'Potato'],
        role: 'farmer',
        farmerIdCode: code,
        avatarUrl: '/farmer_avatar.jpg',
      }
    }

    // Save to registered farmers index for instant future logins
    this.saveRegisteredFarmer(email, payload.phone, password, createdUser)
    this.currentUser = createdUser
    this.saveToStorage(createdUser)
    return createdUser
  }

  public async sendOtp(phone: string): Promise<OtpRequestResult> {
    await new Promise((r) => setTimeout(r, 600))
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length < 10) {
      return {
        success: false,
        message: 'Please enter a valid 10-digit mobile number.',
      }
    }

    const simulatedOtp = '482910'
    return {
      success: true,
      message: `OTP sent to +91 ${cleaned.slice(-10)}. (Demo Code: ${simulatedOtp})`,
      simulatedOtp,
    }
  }

  public async verifyOtp(phone: string, otp: string): Promise<FarmerProfile> {
    if (!otp || otp.trim().length !== 6) {
      throw new Error('Please enter the 6-digit verification code.')
    }

    const cleaned = phone.replace(/\D/g, '').slice(-10)

    // If Supabase is available, create or sign into Supabase with standard credentials
    if (supabase) {
      try {
        return await this.loginWithSupabase(cleaned, `Kisan@${otp}`)
      } catch {
        // If not already existing, sign up
        try {
          return await this.signUpWithSupabase({
            fullName: `Farmer +91 ${cleaned}`,
            phone: `+91 ${cleaned}`,
            district: 'Pune District',
            state: 'Maharashtra',
            farmName: 'Verified Farm',
            landSizeHectares: 2.0,
            primaryCrops: ['Tomato', 'Potato'],
            password: `Kisan@${otp}`,
          })
        } catch {
          // Fallback to local user
        }
      }
    }

    const existing = DEMO_FARMERS.find((f) => f.phone.replace(/\D/g, '').includes(cleaned))
    const user: FarmerProfile = existing || {
      id: `farmer-${Date.now().toString(36)}`,
      fullName: 'Kisan Member',
      phone: `+91 ${cleaned}`,
      district: 'Pune District',
      state: 'Maharashtra',
      farmName: 'Registered Farm Plot',
      landSizeHectares: 2.0,
      primaryCrops: ['Tomato', 'Potato'],
      role: 'farmer',
      farmerIdCode: `#MH-${Math.floor(1000 + Math.random() * 9000)}`,
      avatarUrl: '/farmer_avatar.jpg',
    }

    this.currentUser = user
    this.saveToStorage(user)
    return user
  }

  public async loginDemoFarmer(farmerId: string): Promise<FarmerProfile> {
    await new Promise((r) => setTimeout(r, 200))
    const found = DEMO_FARMERS.find((f) => f.id === farmerId) || DEMO_FARMERS[0]
    this.currentUser = found
    this.saveToStorage(found)
    return found
  }

  public async registerFarmer(payload: RegisterFarmerPayload): Promise<FarmerProfile> {
    if (supabase) {
      try {
        return await this.signUpWithSupabase(payload)
      } catch (err) {
        console.warn('Supabase registration fallback:', err)
      }
    }

    const code = `#${payload.state.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    const newUser: FarmerProfile = {
      id: `farmer-${Date.now().toString(36)}`,
      fullName: payload.fullName,
      phone: payload.phone,
      district: payload.district,
      state: payload.state,
      farmName: payload.farmName || 'Kisan Agricultural Plot',
      landSizeHectares: payload.landSizeHectares || 1.5,
      primaryCrops: payload.primaryCrops.length > 0 ? payload.primaryCrops : ['Potato', 'Tomato'],
      role: 'farmer',
      farmerIdCode: code,
      avatarUrl: '/farmer_avatar.jpg',
    }

    this.currentUser = newUser
    this.saveToStorage(newUser)
    return newUser
  }

  public async logout(): Promise<void> {
    this.currentUser = null
    this.saveToStorage(null)
    if (supabase) {
      try {
        await supabase.auth.signOut()
      } catch {
        // Ignore
      }
    }
  }
}

export const authService = new AuthService()
