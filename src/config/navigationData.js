// Navigation and Dock Configuration for Logged-Out and Logged-In States

export const navLinksLoggedOut = [
  { label: 'Committees', href: '/committees' },
  { label: 'Live Events', href: '/events' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'About', href: '/about' },
]

export const navLinksLoggedIn = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Committees', href: '/committees' },
  { label: 'Live Events', href: '/events' },
  { label: 'My registrations', href: '/registrations' },
  { label: 'Leaderboard', href: '/leaderboard' },
]

// Desktop Side Dock Configuration (Strictly 4 buttons)
export const sideDockLoggedOut = [
  {
    id: 'registerCommittee',
    label: 'Register committee',
    sub: 'Committee signup',
    icon: 'building',
    isLime: true,
  },
  {
    id: 'joinStudent',
    label: 'Join as student',
    sub: 'Student signup',
    icon: 'student',
    isLime: false,
  },
  {
    id: 'search',
    label: 'Search',
    sub: 'Committee / College',
    icon: 'search',
    isLime: false,
  },
  {
    id: 'contact',
    label: 'Contact',
    sub: 'WhatsApp / Email',
    icon: 'contact',
    isLime: false,
  },
]

export const sideDockLoggedIn = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    sub: 'My Overview',
    icon: 'dashboard',
    isLime: true,
  },
  {
    id: 'search',
    label: 'Search',
    sub: 'Committees & Events',
    icon: 'search',
    isLime: false,
  },
  {
    id: 'create',
    label: 'Create',
    sub: 'Committee or Event',
    icon: 'create',
    isLime: false,
  },
  {
    id: 'help',
    label: 'Help',
    sub: 'Support & FAQs',
    icon: 'help',
    isLime: false,
  },
]

// Mobile Bottom Bar Configuration (Strictly 4 buttons)
export const mobileBottomLoggedOut = [
  { id: 'registerCommittee', label: 'Register', icon: 'building', isLime: true },
  { id: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard', isLime: false },
  { id: 'search', label: 'Search', icon: 'search', isLime: false },
  { id: 'contact', label: 'Contact', icon: 'contact', isLime: false },
]

export const mobileBottomLoggedIn = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', isLime: true },
  { id: 'events', label: 'Live Events', icon: 'events', isLime: false },
  { id: 'notifications', label: 'Notifications', icon: 'bell', isLime: false, hasBadge: true },
  { id: 'profile', label: 'Profile', icon: 'profile', isLime: false },
]

// Mock User Data for Preview / Testing
export const mockStudentUser = {
  id: '',
  fullName: '',
  email: '',
  role: 'student',
  avatarUrl: null,
  initials: '',
  unreadNotificationsCount: 0,
  notifications: [],
  committees: [],
  registrations: [],
}

export const mockLeadUser = {
  id: '',
  fullName: '',
  email: '',
  role: 'lead',
  avatarUrl: null,
  initials: '',
  unreadNotificationsCount: 0,
  notifications: [],
  managedCommittee: {
    name: 'Campus Committee',
    tagline: 'Visual identities, media & creative student events.',
    memberCount: 0,
    activeRecruitment: true,
    requestsCount: 0,
    inviteCode: 'CAMPUS',
    members: [],
    pendingRequests: [],
  },
}

