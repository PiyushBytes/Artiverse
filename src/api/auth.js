const RAW_API_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_PROXY_TARGET ||
  ''
).trim().replace(/\/$/, '')

/**
 * Resolve the target endpoint.
 * In dev environment (localhost or browser port), prefer relative path '/av/accounts/...'
 * to leverage Vite's reverse proxy and bypass browser CORS restrictions.
 */
function getAccountsEndpoint(path) {
  const cleanPath = path.replace(/^\/+|\/+$/g, '')
  if (typeof window !== 'undefined' && window.location && window.location.port) {
    return `/av/accounts/${cleanPath}/`
  }
  if (!RAW_API_URL) {
    return `/av/accounts/${cleanPath}/`
  }
  if (RAW_API_URL.endsWith('/av/accounts')) {
    return `${RAW_API_URL}/${cleanPath}/`
  }
  if (RAW_API_URL.endsWith('/av')) {
    return `${RAW_API_URL}/accounts/${cleanPath}/`
  }
  return `${RAW_API_URL}/av/accounts/${cleanPath}/`
}

function formatValidationValue(value) {
  if (Array.isArray(value)) return value.map(formatValidationValue).filter(Boolean).join(' ')
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([key, nested]) => `${key}: ${formatValidationValue(nested)}`)
      .filter(Boolean)
      .join(' ')
  }
  return value == null ? '' : String(value)
}

/**
 * Robust JSON POST requester with 8-second timeout guard.
 */
async function post(path, payload, extraHeaders = {}, timeoutMs = 8000) {
  const targetUrl = getAccountsEndpoint(path)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  let response
  try {
    response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...extraHeaders,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timer)
    if (err.name === 'AbortError') {
      throw new Error(
        `Connection timed out (${timeoutMs / 1000}s). Server at ${RAW_API_URL || 'backend'} took too long to respond. Please check if your backend is running.`
      )
    }
    throw new Error(
      `Unable to reach backend server (${RAW_API_URL || 'local server'}). Please verify your backend server is running and reachable.`
    )
  } finally {
    clearTimeout(timer)
  }

  const contentType = response.headers.get('content-type') || ''
  const responseText = await response.text()

  // Guard against SPA index.html fallback from Vite/Vercel when backend is not responding
  if (!contentType.includes('application/json')) {
    throw new Error(
      'Backend returned an unexpected non-JSON response. Please ensure your backend server is running.'
    )
  }

  let data = {}
  try {
    data = responseText ? JSON.parse(responseText) : {}
  } catch {
    throw new Error('Server returned an unreadable response.')
  }

  if (!response.ok) {
    const validation = data.errors || (data.detail && typeof data.detail === 'object' ? data.detail : null)
    const fieldErrors = validation && !Array.isArray(validation) ? Object.fromEntries(
      Object.entries(validation).map(([field, value]) => [field, formatValidationValue(value)]).filter(([, value]) => value)
    ) : {}
    const fieldMessage = Object.entries(fieldErrors).map(([field, message]) => `${field}: ${message}`).join(' ')
    const detail = typeof data.detail === 'string' ? data.detail : data.message || data.error
    const message = formatValidationValue(detail) || formatValidationValue(validation) || fieldMessage || `Request failed (${response.status}).`
    const error = new Error(message)
    error.status = response.status
    error.fieldErrors = fieldErrors
    error.data = data
    throw error
  }
  return data
}

// ── 1. Create Profile API ──
export const createProfile = (payload) => post('create-profile', payload)

// ── 2. Resend OTP API ──
export const resendOtp = ({ identifier }) => post('resend-otp', { identifier })

// ── 3. Verify OTP API ──
export const verifyOtp = ({ identifier, otp }) => post('verify-otp', { identifier, otp })

// ── 4. Login API (Identifier + PIN) ──
export const loginWithPin = ({ identifier, pin }) => post('login', { identifier, pin })

// ── 5. Logout API ──
export function logoutFromServer() {
  let tokens = null
  try {
    tokens = JSON.parse(localStorage.getItem('artiverse_auth_tokens') || 'null')
  } catch {
    tokens = null
  }

  if (!tokens?.access || !tokens?.refresh) {
    return Promise.reject(new Error('Your session tokens are missing.'))
  }

  return post('logout', { refresh: tokens.refresh }, {
    Authorization: `Bearer ${tokens.access}`,
  })
}

// ── 6. Account Existence Check against Database ──
export async function checkAccount(identifier) {
  try {
    // Attempt probing login with placeholder PIN to test identifier presence in database
    const response = await post('login', { identifier, pin: '____' })
    // If by any chance it accepted, account exists
    return { exists: true, status: 'has_pin', user: response.user }
  } catch (err) {
    const msg = (err.message || '').toLowerCase()

    // Case A: User does NOT exist in database -> redirect to register flow
    if (
      msg.includes('not found') ||
      msg.includes('does not exist') ||
      msg.includes('no user') ||
      msg.includes('no account') ||
      msg.includes('not registered') ||
      err.status === 404
    ) {
      return { exists: false, status: 'not_found', message: err.message }
    }

    // Case B: Signup pending OTP verification
    if (
      msg.includes('verify') ||
      msg.includes('is_mail_verified') ||
      msg.includes('pending')
    ) {
      return { exists: true, status: 'pending_otp', message: err.message }
    }

    // Case C: User exists but PIN was wrong or required -> prompt for user's PIN!
    if (
      msg.includes('pin') ||
      msg.includes('invalid') ||
      msg.includes('incorrect') ||
      msg.includes('credential') ||
      err.status === 400 ||
      err.status === 401
    ) {
      return { exists: true, status: 'has_pin', message: err.message }
    }

    // Connection or network error
    throw err
  }
}

// ── Session persistence utilities ──
export function persistAuthSession(response, fallbackRole = 'student') {
  if (!response?.user) {
    throw new Error('The server response did not include a valid user profile.')
  }

  const user = response.user
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ')
  const userRole = user.role || fallbackRole || 'student'
  const currentUser = {
    ...user,
    role: userRole,
    fullName: fullName || user.email || user.phone_number || 'Creator',
  }
  localStorage.setItem('artiverse_current_user', JSON.stringify(currentUser))
  if (response.tokens) {
    localStorage.setItem('artiverse_auth_tokens', JSON.stringify(response.tokens))
  }
  return currentUser
}

export function clearAuthSession() {
  localStorage.removeItem('artiverse_current_user')
  localStorage.removeItem('artiverse_auth_tokens')
}
