export interface DashboardUser {
  id?: string | number
  first_name?: string
  last_name?: string
  fullName?: string
  name?: string
  email?: string
  phone_number?: string
  college?: string
  course?: string
  dept?: string
  avatar_url?: string
  profile_image?: string
  is_verified?: boolean
  verified?: boolean
  role?: string
  spotlight_url?: string
  public_profile_url?: string
  applications?: DashboardApplication[]
  committee_applications?: DashboardApplication[]
  recruitment_applications?: DashboardApplication[]
  registrations?: DashboardPass[]
  event_passes?: DashboardPass[]
  passes?: DashboardPass[]
  verified_record?: DashboardVerifiedRecord[] | DashboardVerifiedRecordCollection
  verified_roles?: DashboardVerifiedRecord[]
  verified_contributions?: DashboardVerifiedRecord[]
  upcoming?: DashboardUpcomingItem[]
  upcoming_slots?: DashboardUpcomingItem[]
  event_deadlines?: DashboardUpcomingItem[]
  notifications?: DashboardNotification[]
  unreadNotificationsCount?: number
  [field: string]: unknown
}

export interface DashboardCommittee {
  id?: string | number
  committee_username?: string
  username?: string
  slug?: string
  committee_name?: string
  name?: string
  committee_logo?: string
  logo?: string
  role?: string
  status?: string
  date_of_creation?: string
  joined_at?: string
  date_of_joining?: string
  [field: string]: unknown
}

export interface CommitteeListResponse {
  owned?: DashboardCommittee[]
  member_of?: Array<DashboardCommittee | { committee?: DashboardCommittee; role?: string }>
  pending_requests?: unknown[]
}

export interface DashboardApplication {
  id?: string | number
  committee_name?: string
  committee_username?: string
  committee?: { name?: string; username?: string; slug?: string }
  domain?: string
  stage?: string
  status?: string
  next_step_date?: string
  updated_at?: string
  [field: string]: unknown
}

export interface DashboardPass {
  id?: string | number
  event_name?: string
  eventTitle?: string
  event?: { name?: string; title?: string }
  status?: string
  date?: string
  starts_at?: string
  valid_until?: string
  pass_number?: string
  passNumber?: string
  qr_code?: string
  qr_payload?: string
  qrData?: string
  qr_image_url?: string
  qr_image?: string
  [field: string]: unknown
}

export interface DashboardVerifiedRecord {
  id?: string | number
  title?: string
  role?: string
  contribution?: string
  verifier?: string | { name?: string }
  verified?: boolean
  is_verified?: boolean
  status?: string
  verified_at?: string
  date?: string
  [field: string]: unknown
}

export interface DashboardVerifiedRecordCollection {
  roles?: DashboardVerifiedRecord[]
  contributions?: DashboardVerifiedRecord[]
}

export interface DashboardUpcomingItem {
  id?: string | number
  title?: string
  name?: string
  type?: string
  date?: string
  starts_at?: string
  deadline?: string
  [field: string]: unknown
}

export interface DashboardNotification {
  id?: string | number
  title?: string
  desc?: string
  body?: string
  time?: string
  created_at?: string
  unread?: boolean
  read?: boolean
}
