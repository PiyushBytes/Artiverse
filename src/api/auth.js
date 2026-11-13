
const RAW_API_URL = (
  import.meta.env.VITE_API_URL ||
  'https://api.arteza.online'
)
  .trim()
  .replace(/\/+$/, '')

/**
 * Resolve backend API endpoint.
 *
 * Development: Uses Vite proxy.
 * Production: Uses the configured backend URL.
 */
function getAccountsEndpoint(path) {
  const cleanPath = path.replace(/^\/+|\/+$/g, '')

  if (import.meta.env.DEV) {
    return `/av/accounts/${cleanPath}/`
  }

  return `${RAW_API_URL}/av/accounts/${cleanPath}/`
}

/**
 * Convert backend validation errors into readable text.
 */
function formatValidationValue(value) {
  if (Array.isArray(value)) {
    return value
      .map(formatValidationValue)
      .filter(Boolean)
      .join(' ')
  }

  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([key, nested]) => {
        return `${key}: ${formatValidationValue(nested)}`
      })
      .filter(Boolean)
      .join(' ')
  }

  return value == null ? '' : String(value)
}

/**
 * Common JSON POST requester.
 */
async function post(path, payload, extraHeaders = {}, timeoutMs = 15000) {
  const targetUrl = getAccountsEndpoint(path)

  const controller = new AbortController()

  const timer = setTimeout(() => {
    controller.abort()
  }, timeoutMs)

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
    console.error('Arteza API connection error:', {
      url: targetUrl,
      error: err,
      message: err.message,
    })

    if (err.name === 'AbortError') {
      throw new Error(
        `Connection timed out after ${timeoutMs / 1000} seconds. Please try again.`
      )
    }

    throw new Error(
      `Unable to connect to backend. Check CORS and server configuration. API: ${targetUrl}`
    )
  } finally {
    clearTimeout(timer)
  }

  const contentType = response.headers.get('content-type') || ''
  const responseText = await response.text()

  if (!contentType.includes('application/json')) {
    throw new Error(
      `Backend returned an unexpected response (${response.status}). Check the API URL and server configuration.`
    )
  }

  let data = {}

  try {
    data = responseText ? JSON.parse(responseText) : {}
  } catch {
    throw new Error('Server returned an unreadable response.')
  }

  if (!response.ok) {
    let message = ''
    if (typeof data.detail === 'string' && data.detail.trim()) {
      message = data.detail.trim()
    } else if (typeof data.message === 'string' && data.message.trim()) {
      message = data.message.trim()
    } else if (data.non_field_errors) {
      message = formatValidationValue(data.non_field_errors)
    } else {
      const source = data.errors || data
      const fieldEntries = Object.entries(source)
        .filter(([k]) => !['status', 'code', 'error_code'].includes(k))
        .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${formatValidationValue(v)}`)
        .filter(Boolean)
      message = fieldEntries.length > 0 ? fieldEntries.join(' · ') : `Request failed (${response.status}).`
    }

    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

// ----------------------------------------
// 1. CREATE PROFILE
// ----------------------------------------

export const createProfile = (payload) => {
  return post('create-profile', payload)
}

// ----------------------------------------
// 2. RESEND OTP
// ----------------------------------------

export const resendOtp = ({ identifier }) => {
  return post('resend-otp', {
    identifier,
  })
}

// ----------------------------------------
// 3. VERIFY OTP
// ----------------------------------------

export const verifyOtp = ({ identifier, otp }) => {
  return post('verify-otp', {
    identifier,
    otp,
  })
}

// ----------------------------------------
// 4. LOGIN WITH PIN
// ----------------------------------------

export const loginWithPin = ({ identifier, pin }) => {
  return post('login', {
    identifier,
    pin,
  })
}

// ----------------------------------------
// 5. LOGOUT
// ----------------------------------------

export function logoutFromServer() {
  let tokens = null

  try {
    tokens = JSON.parse(
      localStorage.getItem('artiverse_auth_tokens') || 'null'
    )
  } catch {
    tokens = null
  }

  if (!tokens?.access || !tokens?.refresh) {
    return Promise.reject(
      new Error('Your session tokens are missing.')
    )
  }

  return post(
    'logout',
    {
      refresh: tokens.refresh,
    },
    {
      Authorization: `Bearer ${tokens.access}`,
    }
  )
}

// ----------------------------------------
// 6. SAVE AUTHENTICATION SESSION
// ----------------------------------------

export function persistAuthSession(response, fallbackRole = 'student') {
  if (!response?.user) {
    throw new Error(
      'The server response did not include a valid user profile.'
    )
  }

  const user = response.user

  const fullName = [
    user.first_name,
    user.last_name,
  ]
    .filter(Boolean)
    .join(' ')

  const currentUser = {
    ...user,
    role: user.role || fallbackRole || 'student',
    fullName:
      fullName ||
      user.email ||
      user.phone_number ||
      'Creator',
  }

  localStorage.setItem(
    'artiverse_current_user',
    JSON.stringify(currentUser)
  )

  const tokenPayload =
    response.tokens ||
    response.data?.tokens ||
    response.auth?.tokens ||
    response.data ||
    response.auth ||
    response
  const access =
    tokenPayload?.access ||
    tokenPayload?.access_token ||
    tokenPayload?.accessToken ||
    response.data?.access ||
    response.data?.access_token ||
    response.data?.accessToken ||
    response.auth?.access ||
    response.auth?.access_token ||
    response.access ||
    response.access_token ||
    response.accessToken
  const refresh =
    tokenPayload?.refresh ||
    tokenPayload?.refresh_token ||
    tokenPayload?.refreshToken ||
    response.data?.refresh ||
    response.data?.refresh_token ||
    response.data?.refreshToken ||
    response.auth?.refresh ||
    response.auth?.refresh_token ||
    response.refresh ||
    response.refresh_token ||
    response.refreshToken

  if (typeof access === 'string' && access.trim()) {
    localStorage.setItem(
      'artiverse_auth_tokens',
      JSON.stringify({ access: access.trim(), ...(typeof refresh === 'string' && refresh.trim() ? { refresh: refresh.trim() } : {}) })
    )
  } else {
    // Never keep an older session token when a fresh login response has no access token.
    localStorage.removeItem('artiverse_auth_tokens')
  }

  return currentUser
}

// ----------------------------------------
// 7. CLEAR AUTHENTICATION SESSION
// ----------------------------------------

export function clearAuthSession() {
  localStorage.removeItem('artiverse_current_user')
  localStorage.removeItem('artiverse_auth_tokens')
}
