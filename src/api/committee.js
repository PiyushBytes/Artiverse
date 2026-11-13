const RAW_API_URL = (
  import.meta.env.VITE_API_URL ||
  'https://api.arteza.online'
)
  .trim()
  .replace(/\/+$/, '')

/**
 * Resolve backend Committee API endpoint.
 * Development: Uses Vite proxy (/av).
 * Production: Uses the configured backend URL.
 */
function getCommitteeEndpoint(path) {
  const [pathname, search] = path.split('?')
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '')
  const trailingPath = cleanPath ? `${cleanPath}/` : ''
  const queryString = search ? `?${search}` : ''

  if (import.meta.env.DEV) {
    return `/av/committee/${trailingPath}${queryString}`
  }

  return `${RAW_API_URL}/av/committee/${trailingPath}${queryString}`
}

/**
 * Get stored Bearer access token.
 */
function getAccessToken() {
  try {
    const tokens = JSON.parse(
      localStorage.getItem('artiverse_auth_tokens') || 'null'
    )
    if (typeof tokens === 'string') return tokens.trim() || null
    return tokens?.access || tokens?.access_token || tokens?.accessToken || null
  } catch {
    return null
  }
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
      .map(([key, nested]) => `${key.replace(/_/g, ' ')}: ${formatValidationValue(nested)}`)
      .filter(Boolean)
      .join(' ')
  }

  return value == null ? '' : String(value).trim()
}

/**
 * Extract clean, descriptive error message from Django REST Framework responses.
 */
export function extractErrorMessage(data, status = 400) {
  if (!data || typeof data !== 'object') {
    return `Request failed with status ${status}.`
  }

  // 1. Direct string detail or message
  if (typeof data.detail === 'string' && data.detail.trim()) {
    return data.detail.trim()
  }
  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message.trim()
  }
  if (typeof data.error === 'string' && data.error.trim()) {
    return data.error.trim()
  }

  // 2. Non-field errors
  if (data.non_field_errors) {
    const nfe = formatValidationValue(data.non_field_errors)
    if (nfe) return nfe
  }

  // 3. Top-level DRF serializer field errors (e.g. { committee_username: ["..."] })
  const source =
    data.errors && typeof data.errors === 'object'
      ? data.errors
      : data.detail && typeof data.detail === 'object'
      ? data.detail
      : data

  const entries = Object.entries(source)
    .filter(([key]) => !['status', 'code', 'error_code'].includes(key))
    .map(([key, val]) => {
      const fieldName = key.replace(/_/g, ' ')
      const msg = formatValidationValue(val)
      return msg ? `${fieldName}: ${msg}` : ''
    })
    .filter(Boolean)

  if (entries.length > 0) {
    return entries.join(' · ')
  }

  return `Request failed (${status}).`
}

/**
 * Authorized JSON requester for Committee APIs.
 */
async function requestCommittee(path, { method = 'POST', payload, extraHeaders = {}, timeoutMs = 15000 } = {}) {
  const targetUrl = getCommitteeEndpoint(path)
  const token = getAccessToken()

  if (!token) {
    throw new Error('Please sign in first to perform committee operations.')
  }

  const controller = new AbortController()
  const timer = setTimeout(() => {
    controller.abort()
  }, timeoutMs)

  let response

  try {
    response = await fetch(targetUrl, {
      method,
      headers: {
        Accept: 'application/json',
        ...(payload === undefined || method === 'GET' ? {} : { 'Content-Type': 'application/json' }),
        Authorization: `Bearer ${token}`,
        ...extraHeaders,
      },
      ...(payload === undefined || method === 'GET' ? {} : { body: JSON.stringify(payload) }),
      signal: controller.signal,
    })
  } catch (networkErr) {
    clearTimeout(timer)
    if (networkErr.name === 'AbortError') {
      throw new Error('Connection timed out. Committee service took too long to respond.')
    }
    throw new Error('Unable to connect to the backend server. Please check your connection.')
  } finally {
    clearTimeout(timer)
  }

  const responseText = await response.text()

  let data = {}
  try {
    data = responseText ? JSON.parse(responseText) : {}
  } catch {
    throw new Error('Server returned an unreadable response.')
  }

  if (!response.ok) {
    if (response.status === 401) {
      const error = new Error('Your saved access token was rejected or expired. Sign out, sign in again, then retry creating the committee.')
      error.status = response.status
      error.data = data
      throw error
    }
    const message = extractErrorMessage(data, response.status)
    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

const postCommittee = (path, payload = {}, extraHeaders = {}, timeoutMs = 15000) =>
  requestCommittee(path, { method: 'POST', payload, extraHeaders, timeoutMs })

const getCommittee = (path, timeoutMs = 15000) =>
  requestCommittee(path, { method: 'GET', timeoutMs })

// ----------------------------------------
// 1. CREATE COMMITTEE
// POST /av/committee/create-committee/
// ----------------------------------------
export const createCommittee = async ({
  committee_username,
  committee_name,
  committee_description,
  committee_mail,
}) => {
  const payload = {
    committee_username: String(committee_username || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
    committee_name: String(committee_name || '').trim(),
    committee_description: String(committee_description || '').trim(),
    committee_mail: String(committee_mail || '').trim(),
  }

  if (import.meta.env.DEV) {
    console.debug('[committee:create] committee_username:', payload.committee_username)
  }

  return postCommittee('create-committee', payload)
}

// ----------------------------------------
// 2. JOIN COMMITTEE
// POST /av/committee/join-committee/
// ----------------------------------------
export const joinCommittee = ({ committee_username }) => {
  return postCommittee('join-committee', {
    committee_username,
  })
}

// ----------------------------------------
// 3. GET JOIN REQUESTS
// GET /av/committee/join-requests/
// ----------------------------------------
export const getJoinRequests = () => getCommittee('join-requests')

// ----------------------------------------
// 4. REVIEW JOIN REQUEST
// POST /av/committee/join-requests/<int:pk>/review/
// ----------------------------------------
export const reviewJoinRequest = ({ requestId, action = 'approve' }) => {
  if (!requestId) {
    throw new Error('Request ID is required to review a join application.')
  }
  return postCommittee(`join-requests/${requestId}/review`, {
    action,
  })
}

// ----------------------------------------
// 5. GET COMMITTEE LIST (OWNED, MEMBER_OF, PENDING)
// GET /av/committee/committee-list/
// Deduplicated: prevents multiple simultaneous requests
// ----------------------------------------
let inFlightCommitteeList = null

export const getCommitteeList = (forceRefresh = false) => {
  if (inFlightCommitteeList && !forceRefresh) {
    return inFlightCommitteeList
  }

  inFlightCommitteeList = getCommittee('committee-list')
    .finally(() => {
      setTimeout(() => {
        inFlightCommitteeList = null
      }, 500)
    })

  return inFlightCommitteeList
}

