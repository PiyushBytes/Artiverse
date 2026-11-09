export async function submitApplication(data) {
  const url = import.meta.env.VITE_SHEET_WEBHOOK_URL
  if (!url) throw new Error('Applications are not open for online submission yet. Please contact the Artiverse team.')
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(data)
  })
  const result = await response.json()
  if (!result.ok) throw new Error(result.message || 'Unable to submit application.')
  return result
}
