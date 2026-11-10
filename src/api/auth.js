const API_BASE = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '')

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
  const response = await fetch(`${API_BASE}/av/accounts/${path}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...extraHeaders },
    body: JSON.stringify(payload),
  })
  const responseText = await response.text()
  let data = {}
  let plainTextError = ''
  try {
    data = responseText ? JSON.parse(responseText) : {}
  } catch {
    data = {}
    if (responseText) {
      plainTextError = new DOMParser()
        .parseFromString(responseText, 'text/html')
        .body.textContent.replace(/\s+/g, ' ').trim().slice(0, 500)
    }
  }
  if (!response.ok) {
    const validation = data.errors || (data.detail && typeof data.detail === 'object' ? data.detail : null)
    const fieldErrors = validation && !Array.isArray(validation) ? Object.fromEntries(
      Object.entries(validation).map(([field, value]) => [field, formatValidationValue(value)]).filter(([, value]) => value)
    ) : {}
    const fieldMessage = Object.entries(fieldErrors).map(([field, message]) => `${field}: ${message}`).join(' ')
    const detail = typeof data.detail === 'string' ? data.detail : data.message || data.error
    const message = formatValidationValue(detail) || formatValidationValue(validation) || fieldMessage || plainTextError || `Request failed (${response.status}).`
    const error = new Error(message)
    error.status = response.status
    error.fieldErrors = fieldErrors
    throw error
  }
  return data
}

export const createProfile = (payload) => post('create-profile', payload)
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

export function persistAuthSession(response) {
  if (!response?.user) throw new Error('The server response did not include a user profile.')

  const user = response.user
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ')
  const currentUser = { ...user, fullName: fullName || user.email || user.phone_number || 'Creator' }
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
