// Rich default/template data for Committee Profile Pages
// Dynamically merged with real API committee attributes

export const defaultCommitteeProfile = {
  about:
    'Dedicated student council fostering campus culture, talent incubation, and professional leadership through high-impact initiatives, creative productions, and college-wide festivals.',
  mission:
    'To build an inclusive platform where students discover their creative voice, master collaborative execution, and represent university excellence on regional and national stages.',
  foundedYear: '2025',
  college: 'Campus University Council',
  category: 'Creative Arts & Design',
  accentColor: '#d4ff1f',
  coverGradient: 'linear-gradient(135deg, #0d0f08 0%, #1a2210 50%, #2a3818 100%)',
  stats: {
    membersCount: 42,
    eventsHeld: 8,
    upcomingEventsCount: 2,
    totalAttendance: 1420,
    ticketsSold: 389,
  },
  socials: {
    email: 'contact.committee@campus.edu',
    instagram: 'https://instagram.com/campus_committee',
    linkedin: 'https://linkedin.com/company/campus-committee',
    website: 'https://artiverse.online',
  },
  recruitment: {
    isOpen: true,
    deadline: 'March 20, 2026',
    domains: [
      { name: 'Branding & UI/UX', slots: '3 open', desc: 'Visual identities, Figma components and festival posters.' },
      { name: 'Event Management', slots: '4 open', desc: 'Stage operations, guest handling, and crowd logistics.' },
      { name: 'Public Relations & Sponsorship', slots: '2 open', desc: 'Brand partnerships, pitching decks and media coverage.' },
      { name: 'Web & Tech Dev', slots: '3 open', desc: 'Ticketing scanners, portals, and interactive digital showcases.' },
    ],
  },
  whatWeDo: [
    { id: 'design', title: 'Design & Visual Systems', desc: 'Festival branding, stage backdrops, print media, and social templates.', icon: '🎨' },
    { id: 'events', title: 'Campus Productions', desc: 'Flagship cultural conclaves, live open mics, design jams, and hackathons.', icon: '⚡' },
    { id: 'tech', title: 'Digital & Open Tech', desc: 'Custom scanning apps, registration portals, and interactive stage screens.', icon: '💻' },
    { id: 'pr', title: 'Brand & Industry PR', desc: 'Connecting campus talents with industry sponsors, judges, and press.', icon: '📣' },
  ],
  teamLadder: [
    { role: 'President & Founder', name: 'Council Lead', initials: 'CL', tier: 'Executive' },
    { role: 'Vice President', name: 'Operations VP', initials: 'VP', tier: 'Executive' },
    { role: 'General Secretary', name: 'Council GS', initials: 'GS', tier: 'Core Leadership' },
    { role: 'Joint Secretary', name: 'Logistics Lead', initials: 'JS', tier: 'Core Leadership' },
    { role: 'Treasurer', name: 'Finance Head', initials: 'TR', tier: 'Finance' },
    { role: 'Creative Director (POC)', name: 'Creative POC', initials: 'CD', tier: 'Domain Lead' },
    { role: 'Technical Head (POC)', name: 'Tech POC', initials: 'TH', tier: 'Domain Lead' },
    { role: 'PR & Media Head (POC)', name: 'Media POC', initials: 'PR', tier: 'Domain Lead' },
  ],
  nextEvent: {
    id: 'ev_next_1',
    title: 'Artiverse Spring Conclave 2026',
    date: 'April 18, 2026',
    time: '11:00 AM - 6:00 PM',
    venue: 'Auditorium Hall A',
    tagline: 'Annual flagship arts, tech, and cultural summit.',
    ticketPrice: '₹99',
    totalPasses: 400,
    passesSold: 284,
    daysLeft: 14,
  },
  eventsTimeline: [
    {
      id: 'ev_1',
      title: 'Spring Conclave 2026',
      date: 'April 18, 2026',
      status: 'upcoming',
      venue: 'Main Auditorium',
      desc: 'Annual flagship arts and media showcase with panel talks and live showcases.',
      passes: 'Passes Live · ₹99',
    },
    {
      id: 'ev_2',
      title: 'Design Jam & Ideathon',
      date: 'May 04, 2026',
      status: 'upcoming',
      venue: 'Creative Studio Lab',
      desc: '12-hour design sprint for brand designers and creative technologists.',
      passes: 'Free Entry · RSVP Required',
    },
    {
      id: 'ev_3',
      title: 'Campus Winter Showcase',
      date: 'Dec 15, 2025',
      status: 'past',
      venue: 'Campus Amphitheatre',
      desc: 'Evening exhibition of student canvas art, digital motion, and acoustic sets.',
      passes: '420 Attendees · Concluded',
    },
  ],
  verifiedContributions: [
    {
      id: 'c_1',
      member: 'Aarav Sharma',
      role: 'Brand Lead',
      work: 'Designed primary brand guidelines and stage identity for Conclave 2026.',
      date: 'Feb 2026',
      status: 'Approved by Council',
    },
    {
      id: 'c_2',
      member: 'Sneha Roy',
      role: 'Web POC',
      work: 'Built the real-time QR gate entry check-in scanner system.',
      date: 'Jan 2026',
      status: 'Approved by Council',
    },
    {
      id: 'c_3',
      member: 'Rohan Sen',
      role: 'Operations Lead',
      work: 'Negotiated headline audio-visual logistics and auditorium sponsor spaces.',
      date: 'Dec 2025',
      status: 'Approved by Council',
    },
  ],
  sponsors: [
    { name: 'Red Bull Campus Cricket', tier: 'Title Partner' },
    { name: 'Figma Community', tier: 'Creative Sponsor' },
    { name: 'GitHub Campus', tier: 'Tech Partner' },
    { name: 'Monster Energy', tier: 'Beverage Partner' },
  ],
  announcements: [
    {
      id: 'ann_1',
      title: 'Spring Recruitment Cycle 2026 Announced!',
      date: '2 hours ago',
      author: 'Council Lead',
      content:
        'Applications are now officially open for Creative Design, Web Tech, PR, and Stage Operations. Review open positions and apply via the portal.',
      pinned: true,
    },
    {
      id: 'ann_2',
      title: 'Core Committee Sync Meeting this Friday',
      date: 'Yesterday',
      author: 'Operations VP',
      content:
        'All domain leads and executive members: please join the planning room at 5:00 PM for the Spring Conclave agenda and budget signoff.',
      pinned: false,
    },
  ],
  gallery: [
    { id: 'g1', title: 'Winter Arts Night', photosCount: 24, coverEmoji: '📸' },
    { id: 'g2', title: 'Annual Orientation 2025', photosCount: 38, coverEmoji: '🎨' },
    { id: 'g3', title: 'Hack & Design Jam', photosCount: 16, coverEmoji: '💻' },
    { id: 'g4', title: 'Stage Fest Rehearsals', photosCount: 42, coverEmoji: '🎭' },
  ],
  resources: [
    { id: 'r1', title: 'Official Council Brand Kit & Figma Styles', type: 'Design Kit (Figma)', size: '12 MB' },
    { id: 'r2', title: 'Event Production Checklist & SOPs', type: 'Document (PDF)', size: '2.4 MB' },
    { id: 'r3', title: 'Sponsorship Pitch Deck Template 2026', type: 'Slide Deck (Google Slides)', size: '8.1 MB' },
    { id: 'r4', title: 'Member Attendance & OD Request Form', type: 'Spreadsheet Template', size: '1.2 MB' },
  ],
}

