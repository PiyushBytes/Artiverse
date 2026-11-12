// Navigation and Dock Configuration for Logged-Out and Logged-In States

export const navLinksLoggedOut = [
  { label: 'Committees', href: '/committees' },
  { label: 'Students', href: '/apply' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
]

export const navLinksLoggedIn = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Committees', href: '/committees' },
  { label: 'My registrations', href: '/registrations' },
  { label: 'How it works', href: '/how-it-works' },
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
    sub: 'Apna home',
    icon: 'dashboard',
    isLime: true,
  },
  {
    id: 'search',
    label: 'Search',
    sub: 'Find committee',
    icon: 'search',
    isLime: false,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    sub: 'Updates & requests',
    icon: 'bell',
    isLime: false,
    hasBadge: true,
  },
  {
    id: 'contact',
    label: 'Contact',
    sub: 'Help & support',
    icon: 'contact',
    isLime: false,
  },
]

// Mobile Bottom Bar Configuration (Strictly 4 buttons)
export const mobileBottomLoggedOut = [
  { id: 'registerCommittee', label: 'Register', icon: 'building', isLime: true },
  { id: 'joinStudent', label: 'Student', icon: 'student', isLime: false },
  { id: 'search', label: 'Search', icon: 'search', isLime: false },
  { id: 'contact', label: 'Contact', icon: 'contact', isLime: false },
]

export const mobileBottomLoggedIn = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', isLime: true },
  { id: 'search', label: 'Search', icon: 'search', isLime: false },
  { id: 'notifications', label: 'Notifications', icon: 'bell', isLime: false, hasBadge: true },
  { id: 'profile', label: 'Profile', icon: 'profile', isLime: false },
]

// Mock User Data for Preview / Testing
export const mockStudentUser = {
  id: 'usr_student_01',
  fullName: 'Aarav Sharma',
  email: 'aarav.sharma@msit.edu',
  role: 'student',
  avatarUrl: null,
  initials: 'AS',
  unreadNotificationsCount: 3,
  notifications: [
    { id: 'n1', title: 'Shortlisted for PI', desc: 'Design Committee slot: 4:30 PM', time: '12m ago', unread: true },
    { id: 'n2', title: 'Pass Confirmed', desc: 'Cine-Charcha QR Pass ready', time: '1h ago', unread: true },
    { id: 'n3', title: 'Kalakriti’26 Alert', desc: 'Early bird registration live', time: '2h ago', unread: true },
  ],
  committees: [
    { id: 'c1', name: 'Design Committee', role: 'Applicant · Shortlisted', status: 'PI Scheduled', icon: '🎨' },
    { id: 'c2', name: 'Cine Club MSIT', role: 'Active Member', status: 'Confirmed', icon: '🎬' },
  ],
  registrations: [
    { id: 'r1', eventTitle: 'Cine-Charcha', passNumber: '#389', date: 'March 15, 2026', venue: 'MSIT Auditorium', status: 'Active QR' },
    { id: 'r2', eventTitle: "Kalakriti'26 Early Bird", passNumber: '#104', date: 'March 28-30, 2026', venue: 'Main Ground', status: 'Pass Issued' },
  ],
}

export const mockLeadUser = {
  id: 'usr_lead_01',
  fullName: 'Priya Sen',
  email: 'priya.lead@msit.edu',
  role: 'lead',
  avatarUrl: null,
  initials: 'PS',
  unreadNotificationsCount: 5,
  notifications: [
    { id: 'n1', title: '3 New Join Requests', desc: 'Aarav, Sneha, and Rahul applied to Design Committee', time: '5m ago', unread: true },
    { id: 'n2', title: 'Budget Approved', desc: '₹15,000 sanctioned for Cine-Charcha', time: '30m ago', unread: true },
    { id: 'n3', title: 'Council Sync Completed', desc: 'Roster synced with college portal', time: '1d ago', unread: false },
  ],
  managedCommittee: {
    name: 'Design Committee',
    tagline: 'Visual identities, graphics & creative festival branding at MSIT.',
    memberCount: 38,
    activeRecruitment: true,
    requestsCount: 14,
    inviteCode: 'DESIGN-MSIT-26',
    members: [
      { name: 'Priya Sen', role: 'President / Lead', initials: 'PS' },
      { name: 'Siddharth Roy', role: 'Vice President', initials: 'SR' },
      { name: 'Megha Dutta', role: 'General Secretary', initials: 'MD' },
      { name: 'Anik Paul', role: 'POC / Coordinator', initials: 'AP' },
    ],
    pendingRequests: [
      { id: 'req_1', name: 'Aarav Sharma', dept: 'CSE · 2nd Yr', domain: 'UI/UX & Branding', time: '10m ago' },
      { id: 'req_2', name: 'Sneha Roy', dept: 'IT · 1st Yr', domain: 'Illustration & Art', time: '25m ago' },
      { id: 'req_3', name: 'Rahul Ghosh', dept: 'ECE · 2nd Yr', domain: 'Motion Graphics', time: '1h ago' },
    ],
  },
}

