import { ApiError, type RequestOptions } from '../../types/api'

export class ApiClient {
  private readonly baseUrl: string
  private readonly defaultTimeoutMs: number

  constructor(
    baseUrl: string = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5000',
    defaultTimeoutMs: number = 10000
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, '')
    this.defaultTimeoutMs = defaultTimeoutMs
  }

  public getBaseUrl(): string {
    return this.baseUrl
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const url = new URL(`${this.baseUrl}${cleanPath}`)

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          url.searchParams.append(key, String(val))
        }
      })
    }

    return url.toString()
  }

  public async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { timeoutMs = this.defaultTimeoutMs, params, headers, body, ...fetchOptions } = options
    const url = this.buildUrl(path, params)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    // Build headers carefully. Do not set Content-Type if sending FormData!
    const reqHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...((headers as Record<string, string>) || {}),
    }

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    if (!isFormData && !reqHeaders['Content-Type']) {
      reqHeaders['Content-Type'] = 'application/json'
    }

    let serializedBody: BodyInit | null | undefined = body as BodyInit

    if (!isFormData && body !== undefined && typeof body !== 'string') {
      serializedBody = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        body: serializedBody,
        signal: controller.signal,
        headers: reqHeaders,
      })

      clearTimeout(timeoutId)

      let data: unknown
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        try {
          data = await response.json()
        } catch {
          data = null
        }
      } else {
        const text = await response.text()
        data = text ? { raw: text } : null
      }

      if (!response.ok) {
        const errPayload = data as { error?: { message?: string; code?: string; details?: Record<string, unknown> } }
        const message = errPayload?.error?.message || `Request failed with status ${response.status} (${response.statusText})`
        const code = errPayload?.error?.code || `HTTP_${response.status}`
        throw new ApiError(message, response.status, code, errPayload?.error?.details)
      }

      return data as T
    } catch (err: unknown) {
      clearTimeout(timeoutId)

      if (err instanceof ApiError) {
        throw err
      }

      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new ApiError(`Request to ${path} timed out after ${timeoutMs}ms.`, 408, 'REQUEST_TIMEOUT')
      }

      const nativeError = err as Error
      throw new ApiError(
        `Backend connection failed (${this.baseUrl}). Ensure backend server is running and CORS allows origin: ${nativeError?.message || 'Network unreachable'}.`,
        0,
        'NETWORK_FAILURE'
      )
    }
  }

  public get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  public post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body as BodyInit,
    })
  }
}

export const apiClient = new ApiClient()
