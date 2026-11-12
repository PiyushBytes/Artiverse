
const RAW_API_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_PROXY_TARGET ||
  ''
)
  .trim()
  .replace(/\/+$/, '')

/**
 * Resolve backend API endpoint.
 *
 * Development:
 * Uses Vite proxy with relative URLs.
 *
 * Production:
 * Uses the configured backend URL.
 */
function getAccountsEndpoint(path) {
  const cleanPath = path.replace(/^\/+|\/+$/g, '')

  if (import.meta.env.DEV) {
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
    if (err.name === 'AbortError') {
      throw new Error(
        `Connection timed out after ${timeoutMs / 1000} seconds. Please try again.`
      )
    }

    throw new Error(
      `Unable to connect to the backend server. Please check your internet connection or backend server.`
    )
  } finally {
    clearTimeout(timer)
  }

  const contentType = response.headers.get('content-type') || ''
  const responseText = await response.text()

  if (!contentType.includes('application/json')) {
    throw new Error(
      'Backend returned an unexpected response. Please check the API URL and backend configuration.'
    )
  }

  let data = {}

  try {
    data = responseText ? JSON.parse(responseText) : {}
  } catch {
    throw new Error('Server returned an unreadable response.')
  }

  if (!response.ok) {
    const validation =
      data.errors ||
      (data.detail && typeof data.detail === 'object'
        ? data.detail
        : null)

    const fieldErrors =
      validation && !Array.isArray(validation)
        ? Object.fromEntries(
            Object.entries(validation)
              .map(([field, value]) => [
                field,
                formatValidationValue(value),
              ])
              .filter(([, value]) => value)
          )
        : {}

    const fieldMessage = Object.entries(fieldErrors)
      .map(([field, message]) => `${field}: ${message}`)
      .join(' ')

    const detail =
      typeof data.detail === 'string'
        ? data.detail
        : data.message || data.error

    const message =
      formatValidationValue(detail) ||
      fieldMessage ||
      formatValidationValue(validation) ||
      `Request failed (${response.status}).`

    const error = new Error(message)

    error.status = response.status
    error.fieldErrors = fieldErrors
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

  if (response.tokens) {
    localStorage.setItem(
      'artiverse_auth_tokens',
      JSON.stringify(response.tokens)
    )
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
