export const heroContent = {
  chip: 'Now onboarding committees',
  subtext: 'Register your committee, publish events and bring students in, all from one platform.',
  primaryCta: 'Get started',
  secondaryCta: 'See how it works',
  proofHighlight: '240+ students',
  proofText: 'applied this cycle',
}

export const heroRolesData = {
  roles: ['Student', 'Committee', 'Organiser'],
  Student: {
    badge: 'Student View',
    notifications: [
      {
        id: 's1',
        type: 'ticket',
        app: 'Artiverse Pass',
        time: 'Just now',
        title: 'Cine-Charcha · Pass Confirmed',
        desc: 'QR pass active · Gate 2 entry',
        badge: 'ACTIVE',
      },
      {
        id: 's2',
        type: 'star',
        app: 'Artiverse Recruitment',
        time: '12m ago',
        title: 'Shortlisted for PI Round',
        desc: 'Design Committee · Slot: 4:30 PM',
        badge: 'NEW',
      },
      {
        id: 's3',
        type: 'calendar',
        app: 'Campus Life',
        time: '1h ago',
        title: "Kalakriti'26 Passes Live",
        desc: 'Early bird access unlocked · ₹149',
        badge: 'EVENT',
      },
    ],
  },
  Committee: {
    badge: 'Committee View',
    notifications: [
      {
        id: 'c1',
        type: 'users',
        app: 'Artiverse Committee',
        time: 'Just now',
        title: '38 members registered',
        desc: 'Design Committee · 1-click roster synced',
        badge: 'SYNCED',
      },
      {
        id: 'c2',
        type: 'shield',
        app: 'Council Portal',
        time: '24m ago',
        title: 'Budget Sanctioned',
        desc: '₹15,000 approved for Cine-Charcha',
        badge: 'APPROVED',
      },
      {
        id: 'c3',
        type: 'file',
        app: 'Attendance & Certs',
        time: '2h ago',
        title: 'Certificates Dispatched',
        desc: 'Auto-generated for 42 participants',
        badge: 'READY',
      },
    ],
  },
  Organiser: {
    badge: 'Organiser Portal',
    dashboard: {
      sales: '₹48,200',
      sold: '389 / 400',
      scanned: '214',
    },
    notifications: [
      {
        id: 'o1',
        type: 'trending',
        app: 'Live Ticketing',
        time: 'Just now',
        title: '₹48,200 revenue collected',
        desc: '389 / 400 tickets sold (97% full)',
        badge: '97%',
      },
      {
        id: 'o2',
        type: 'qr',
        app: 'Gate Scanner',
        time: '3m ago',
        title: '214 Check-ins Verified',
        desc: 'Gate 2 scanner running · 0 fake passes',
        badge: 'GATE 2',
      },
      {
        id: 'o3',
        type: 'award',
        app: 'Sponsor Analytics',
        time: '35m ago',
        title: 'Sponsor Report Ready',
        desc: '1,420 on-campus impressions logged',
        badge: 'REPORT',
      },
    ],
  },
}

export const heroMockupData = {
  roleCards: {
    Student: { title: 'Entry verified', desc: 'QR scanned · Valid once', meta: 'Cine-Charcha · Pass #389' },
    Committee: { title: 'Roster synced', desc: '38 members · One click', meta: 'Design Committee · Confirmed' },
    Organiser: { title: 'Ticket sales live', desc: '97% capacity · 214 checked in', meta: "Kalakriti'26 · ₹48,200 raised" },
  },
  avatarStack: [
    { initial: 'A', bg: '#f3b5a5' },
    { initial: 'R', bg: '#d6d5f1' },
    { initial: 'T', bg: '#b8d7c1' },
    { initial: 'I', bg: '#f2d08b' },
    { initial: 'V', bg: '#c4d5e8' },
  ],
}
