const RAW_API_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_PROXY_TARGET ||
  ''
).trim().replace(/\/$/, '')

function getAccountsEndpoint(path) {
  const cleanPath = path.replace(/^\/+|\/+$/g, '')
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

async function post(path, payload, extraHeaders = {}) {
  const targetUrl = getAccountsEndpoint(path)
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
    })
  } catch (networkErr) {
    throw new Error(
      'Unable to connect to the backend server. Please verify your internet connection or check if the backend is running.'
    )
  }

  const contentType = response.headers.get('content-type') || ''
  const responseText = await response.text()

  // Guard against SPA index.html fallbacks from Vite or Vercel when backend is unreachable or not configured
  if (!contentType.includes('application/json')) {
    throw new Error(
      'Backend server is unreachable or returned an invalid non-JSON response. Please check your backend URL and proxy settings.'
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
    throw error
  }
  return data
}

export const createProfile = (payload) => post('create-profile', payload)
export const requestLoginOtp = ({ identifier }) => post('login', { identifier })
export const verifyOtp = ({ identifier, otp }) => post('verify-otp', { identifier, otp })
export const loginWithPin = ({ identifier, pin }) => post('login', { identifier, pin })

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
