import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getCommitteeList } from '../api/committee'

const toArray = (value) => Array.isArray(value) ? value : []
const firstArray = (user, keys) => {
  for (const key of keys) {
    if (Array.isArray(user?.[key])) return user[key]
  }
  return []
}
const userKey = (user) => user?.id ?? user?.email ?? user?.fullName ?? 'session'

function signalUnauthorized(error) {
  if (error?.status === 401 && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('artiverse:unauthorized'))
  }
  throw error
}

/** @param {import('../types/dashboard').DashboardUser | null} user */
export function useMe(user) {
  const queryClient = useQueryClient()
  const queryKey = ['dashboard', 'me', userKey(user)]
  useEffect(() => {
    if (user) queryClient.setQueryData(queryKey, user)
  }, [queryClient, user, user?.id, user?.email, user?.fullName])
  return useQuery({
    queryKey,
    queryFn: async () => user,
    enabled: Boolean(user),
    initialData: user ?? undefined,
    staleTime: Infinity,
  })
}

/** @param {import('../types/dashboard').DashboardUser | null} user */
export function useMyCommittees(user) {
  return useQuery({
    queryKey: ['dashboard', 'committees', userKey(user)],
    queryFn: async () => {
      try {
        const result = await getCommitteeList()
        const owned = toArray(result?.owned).map((committee) => ({ ...committee, ownership: 'owned' }))
        const joined = toArray(result?.member_of).map((item) => {
          const committee = item?.committee || item
          return { ...committee, role: item?.role || committee?.role, ownership: 'joined' }
        })
        return { owned, joined, all: [...owned, ...joined] }
      } catch (error) {
        return signalUnauthorized(error)
      }
    },
    enabled: Boolean(user),
    staleTime: 30_000,
    retry: (failureCount, error) => error?.status !== 401 && failureCount < 2,
  })
}

/** @param {import('../types/dashboard').DashboardUser | null} user */
export function useMyApplications(user) {
  return useQuery({
    queryKey: ['dashboard', 'applications', userKey(user)],
    queryFn: async () => firstArray(user, ['applications', 'committee_applications', 'recruitment_applications']),
    enabled: Boolean(user),
    staleTime: 30_000,
  })
}

/** @param {import('../types/dashboard').DashboardUser | null} user */
export function useMyPasses(user) {
  return useQuery({
    queryKey: ['dashboard', 'passes', userKey(user)],
    queryFn: async () => firstArray(user, ['event_passes', 'passes', 'registrations']),
    enabled: Boolean(user),
    staleTime: 30_000,
  })
}

/** @param {import('../types/dashboard').DashboardUser | null} user */
export function useVerifiedRecord(user) {
  return useQuery({
    queryKey: ['dashboard', 'verified-record', userKey(user)],
    queryFn: async () => {
      const record = user?.verified_record
      if (Array.isArray(record)) return record
      if (record && typeof record === 'object') {
        return [...toArray(record.roles), ...toArray(record.contributions)]
      }
      return [...toArray(user?.verified_roles), ...toArray(user?.verified_contributions)]
    },
    enabled: Boolean(user),
    staleTime: 30_000,
  })
}

/** @param {import('../types/dashboard').DashboardUser | null} user */
export function useUpcoming(user) {
  return useQuery({
    queryKey: ['dashboard', 'upcoming', userKey(user)],
    queryFn: async () => {
      const items = [
        ...toArray(user?.upcoming),
        ...toArray(user?.upcoming_slots),
        ...toArray(user?.event_deadlines),
      ]
      const now = Date.now()
      return items
        .map((item) => ({ ...item, dashboardDate: item?.date || item?.starts_at || item?.deadline }))
        .filter((item) => {
          const time = Date.parse(item.dashboardDate)
          return Number.isFinite(time) && time >= now
        })
        .sort((a, b) => Date.parse(a.dashboardDate) - Date.parse(b.dashboardDate))
    },
    enabled: Boolean(user),
    staleTime: 30_000,
  })
}

/** Compute completion from the registration-required name, email and phone fields. */
export function getProfileCompletion(user) {
  const fullNameValue = typeof user?.fullName === 'string' ? user.fullName.trim() : ''
  const nameValue = typeof user?.name === 'string' ? user.name.trim() : ''
  const fullName = fullNameValue && !fullNameValue.includes('@') ? fullNameValue : nameValue && !nameValue.includes('@') ? nameValue : ''
  const firstName = typeof user?.first_name === 'string' ? user.first_name.trim() : ''
  const lastName = typeof user?.last_name === 'string' ? user.last_name.trim() : ''
  const email = typeof user?.email === 'string' ? user.email.trim() : ''
  const phone = typeof user?.phone_number === 'string' ? user.phone_number.trim() : ''
  const hasBothNames = Boolean(firstName && lastName)
  const fields = [
    { id: 'full_name', label: 'Name', complete: hasBothNames || Boolean(fullName), href: '/profile#full_name' },
    { id: 'email', label: 'Email', complete: Boolean(email), href: '/profile#email' },
    { id: 'phone_number', label: 'Phone number', complete: Boolean(phone), href: '/profile#phone_number' },
  ]
  const completed = fields.filter((field) => field.complete).length
  return { fields, completed, total: fields.length, percent: Math.round((completed / fields.length) * 100) }
}

export function getUnreadNotificationsCount(user) {
  if (Number.isFinite(user?.unreadNotificationsCount)) return Math.max(0, user.unreadNotificationsCount)
  return toArray(user?.notifications).filter((notification) => notification?.unread === true || notification?.read === false).length
}

export function isVerifiedRecord(record) {
  return record?.verified === true || record?.is_verified === true || String(record?.status || '').toLowerCase() === 'verified'
}

export function isActiveDashboardPass(pass, now = Date.now()) {
  const status = String(pass?.status || '').trim().toLowerCase()
  if (['cancelled', 'canceled', 'expired', 'refunded', 'revoked'].includes(status)) return false
  const expiry = Date.parse(pass?.valid_until || pass?.ends_at || '')
  if (Number.isFinite(expiry) && expiry < now) return false
  if (['active', 'confirmed', 'valid', 'issued'].includes(status)) return true
  const start = Date.parse(pass?.starts_at || pass?.date || '')
  return !status && Number.isFinite(start) && start >= now
}
