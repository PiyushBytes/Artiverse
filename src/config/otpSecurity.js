// Display policy mirrored from the backend; enforcement stays server-side.
export const OTP_TTL_SECONDS = 300
export const OTP_RESEND_COOLDOWN = 60
export const OTP_MAX_ATTEMPTS = 5

export function getOtpDeadline(response, absoluteKeys, durationKeys, fallbackSeconds) {
  for (const key of absoluteKeys) {
    const parsed = Date.parse(response?.[key] || '')
    if (Number.isFinite(parsed)) return parsed
  }

  for (const key of durationKeys) {
    const seconds = Number(response?.[key])
    if (Number.isFinite(seconds) && seconds >= 0) return Date.now() + seconds * 1000
  }

  return Date.now() + fallbackSeconds * 1000
}
