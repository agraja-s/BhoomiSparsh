import { describe, it, expect, beforeEach } from 'vitest'
import { AuthService } from '../services/authService'

describe('AuthService', () => {
  let auth: AuthService

  beforeEach(() => {
    auth = new AuthService()
  })

  it('initializes as unauthenticated until farmer logs in or signs up', () => {
    expect(auth.isAuthenticated()).toBe(false)
    expect(auth.getCurrentUser()).toBeNull()
  })

  it('validates 10-digit mobile number when sending OTP', async () => {
    const invalidRes = await auth.sendOtp('12345')
    expect(invalidRes.success).toBe(false)
    expect(invalidRes.message).toContain('10-digit')

    const validRes = await auth.sendOtp('9822041209')
    expect(validRes.success).toBe(true)
    expect(validRes.simulatedOtp).toBe('482910')
  })

  it('logs in pre-configured demo farmers seamlessly', async () => {
    const sunita = await auth.loginDemoFarmer('farmer-sunita')
    expect(sunita.fullName).toBe('Sunita Shinde')
    expect(auth.getCurrentUser()?.id).toBe('farmer-sunita')

    const officer = await auth.loginDemoFarmer('officer-anjali')
    expect(officer.role).toBe('extension_officer')
    expect(officer.farmerIdCode).toBe('#AGRI-OFFICER-01')
  })

  it('registers a new farmer profile with generated ID code', async () => {
    const newFarmer = await auth.registerFarmer({
      fullName: 'Vikram Jadhav',
      phone: '+91 91234 56789',
      district: 'Kolhapur',
      state: 'Maharashtra',
      farmName: 'Sahyadri Sugarcane Estate',
      landSizeHectares: 4.2,
      primaryCrops: ['Rice', 'Cotton'],
    })

    expect(newFarmer.fullName).toBe('Vikram Jadhav')
    expect(newFarmer.farmerIdCode).toMatch(/^#MA-\d+/)
    expect(auth.getCurrentUser()?.farmName).toBe('Sahyadri Sugarcane Estate')
  }, 15000)

  it('logs out and clears current user', async () => {
    await auth.logout()
    expect(auth.isAuthenticated()).toBe(false)
    expect(auth.getCurrentUser()).toBeNull()
  })
})
