export interface ApiErrorPayload {
  code: string
  message: string
  details?: Record<string, unknown>
}

export class ApiError extends Error {
  public readonly code: string
  public readonly status: number
  public readonly details?: Record<string, unknown>

  constructor(message: string, status: number = 500, code: string = 'API_ERROR', details?: Record<string, unknown>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export interface RequestOptions extends RequestInit {
  timeoutMs?: number
  params?: Record<string, string | number | boolean | undefined>
}

export type ApiResponse<T> =
  | { success: true; data: T; isMock: boolean }
  | { success: false; error: ApiError; isMock: boolean }
