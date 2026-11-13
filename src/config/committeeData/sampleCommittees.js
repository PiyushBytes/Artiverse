export const sampleCommittees = {
  artikon: {
    slug: 'artikon',
    name: 'ArtiKon MSIT',
    handle: 'artikon_msit',
    tagline: 'The official creative arts, design, and multimedia collective of MSIT.',
    about:
      'ArtiKon is a vibrant student-led design and arts guild uniting graphic designers, 3D artists, visual creators, photographers, and creative technologists. Founded in 2022, we brand campus fests, conduct hands-on creative workshops, curate interactive installations, and publish the campus design zine.',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1800&q=80',
    logo: '🎨',
    accent: '#d4ff1f',
    verified: true,
    college: 'Meghnad Saha Institute of Technology',
    category: 'Creative Arts & Media',
    since: 2022,
    recruitmentOpen: true,
    recruitmentDeadline: 'Nov 30, 2026',
    openDomains: ['Visual Design & Branding', 'Motion & 3D Art', 'Editorial & Content', 'Event Scenography', 'Photography'],
    stats: {
      members: 34,
      events: 18,
      registrations: 2450,
      since: 2022,
    },
    whatWeDo: [
      {
        id: 'brand',
        title: 'Brand & Visual Identity',
        icon: '✨',
        desc: 'Crafting the visual language, poster systems, and digital assets for college fests and flagship hackathons.',
      },
      {
        id: 'motion',
        title: 'Motion & 3D Artwork',
        icon: '🔮',
        desc: 'Creating immersive teaser trailers, 3D title sequences, and kinetic typography for campus stages.',
      },
      {
        id: 'magazine',
        title: 'Editorial & Zine Publishing',
        icon: '📖',
        desc: 'Curating ArtiZine — the annual student publication capturing student essays, poetry, and curated illustrations.',
      },
      {
        id: 'events',
        title: 'Creative Jams & Exhibitions',
        icon: '🎪',
        desc: 'Hosting Figma sprints, live digital painting duels, gallery showcases, and hands-on portfolio reviews.',
      },
    ],
    portfolio: [
      {
        id: 'p1',
        title: 'Paridhi 2026 Fest Visual System',
        category: 'Posters',
        year: '2026',
        event: 'Annual Techno-Management Fest',
        media: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        credits: ['Piyush Dawn', 'Ananya Roy'],
        description: 'Complete brand identity overhaul including 16 sub-event key visuals, stage LED wallpapers, and printed brochures.',
        caseStudy: {
          problem: 'Previous fest branding lacked visual cohesion across 20+ departmental events.',
          process: 'Designed a neo-brutalist kinetic poster generator in p5.js and Figma with custom typography.',
          results: '2,400+ attendees, 100% positive aesthetic rating, 45,000+ social impressions.',
        },
      },
      {
        id: 'p2',
        title: 'Lens & Shadow Photo Exhibition',
        category: 'Photography',
        year: '2025',
        event: 'Autumn Gallery 2025',
        media: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
        credits: ['Rohan Gupta', 'Sneha Banerjee'],
        description: 'Curated 42 street and architectural photography pieces from 80 student submissions for an open-air campus gallery.',
      },
      {
        id: 'p3',
        title: 'ArtiZine Vol. 3: Neon Horizons',
        category: 'Magazine',
        year: '2025',
        event: 'Annual Publication',
        media: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
        credits: ['Tanmay Sen', 'Aisha Khan'],
        description: 'A 64-page printed art zine featuring student editorial features, interviews with alumni artists, and risograph prints.',
      },
      {
        id: 'p4',
        title: 'Design Jam 4.0 Brand Package',
        category: 'Events',
        year: '2026',
        event: '48hr UI/UX Hackathon',
        media: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        credits: ['Piyush Dawn'],
        description: 'End-to-end design system, stage badges, lanyard passes, and web guidelines for 300 hackathon finalists.',
      },
      {
        id: 'p5',
        title: 'Cyberpunk Odyssey Stage Video Loop',
        category: 'Videos',
        year: '2025',
        event: 'Rock Night Concert',
        media: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        credits: ['Vikramaditya Roy'],
        description: 'Real-time audio-reactive visual loops projected on 40ft LED screens during the musical headline.',
      },
      {
        id: 'p6',
        title: 'Typography & Form Study Series',
        category: 'Posters',
        year: '2025',
        event: 'Workshop Showcase',
        media: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
        credits: ['Arijit Ghosh'],
        description: 'An experimental typography exploration combining Bengali calligraphy with Swiss modernist layout principles.',
      },
    ],
    events: [
      {
        id: 'ev1',
        title: 'DesignSprint 2026: Campus UX Battle',
        date: 'Nov 28, 2026',
        time: '11:00 AM IST',
        venue: 'Seminar Hall 3 & Figma Live',
        status: 'upcoming',
        poster: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
        registrationOpen: true,
        summary: '3-hour rapid prototype duel with cash prizes, mentor feedback from top agency leads, and swags.',
      },
      {
        id: 'ev2',
        title: 'Blender 3D Fundamentals Workshop',
        date: 'Oct 14, 2026',
        time: '3:00 PM IST',
        venue: 'Computer Lab 4',
        status: 'past',
        poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        registrationOpen: false,
        summary: 'Introductory sculpting, texturing, and lighting bootcamp for 120 enrolled freshmen.',
      },
      {
        id: 'ev3',
        title: 'Annual Art Exhibition: Chroma 2025',
        date: 'May 02, 2025',
        time: '10:00 AM IST',
        venue: 'Central Auditorium Lawn',
        status: 'past',
        poster: 'https://images.unsplash.com/photo-1460661419200-1845a1ca857e?auto=format&fit=crop&w=800&q=80',
        registrationOpen: false,
        summary: 'Over 85 original student artworks curated and sold to benefit campus charity drive.',
      },
    ],
    council: [
      {
        id: 'c1',
        name: 'Piyush Dawn',
        role: 'Founder & President',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        socials: {
          linkedin: 'https://linkedin.com',
          instagram: 'https://instagram.com',
          portfolio: 'https://artiverse.online',
        },
      },
      {
        id: 'c2',
        name: 'Ananya Roy',
        role: 'Vice President & Design Lead',
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        socials: {
          linkedin: 'https://linkedin.com',
          instagram: 'https://instagram.com',
        },
      },
      {
        id: 'c3',
        name: 'Rohan Gupta',
        role: 'General Secretary',
        photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
        socials: {
          linkedin: 'https://linkedin.com',
        },
      },
      {
        id: 'c4',
        name: 'Sneha Banerjee',
        role: 'Joint Secretary & Photography Head',
        photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
        socials: {
          instagram: 'https://instagram.com',
        },
      },
      {
        id: 'c5',
        name: 'Tanmay Sen',
        role: 'Treasurer & Editorial Lead',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        socials: {
          linkedin: 'https://linkedin.com',
        },
      },
    ],
    journey: [
      {
        year: '2022',
        title: 'Founding of ArtiKon',
        description: 'Initiated by 6 design enthusiasts wanting an official creative space at MSIT.',
      },
      {
        year: '2023',
        title: 'First Annual Exhibition',
        description: 'Organized Chroma 1.0 with 300+ visitors and launched the first issue of ArtiZine.',
      },
      {
        year: '2024',
        title: 'Official Fest Branding Partner',
        description: 'Selected to build the unified visual system for Paridhi and Advaya campus fests.',
      },
      {
        year: '2025',
        title: '1,000+ Design Jam Registrations',
        description: 'Scaled inter-college workshops and won Best Cultural Committee Award.',
      },
      {
        year: '2026',
        title: 'Artiverse Digital Guild Launch',
        description: 'Migrated all recruitment, portfolio verification, and event passes onto Artiverse platform.',
      },
    ],
    achievements: [
      {
        id: 'a1',
        title: 'Best Creative Society 2025',
        issuer: 'MSIT Student Council Awards',
        year: '2025',
        icon: '🏆',
      },
      {
        id: 'a2',
        title: 'National Design Hackathon (Top 5)',
        issuer: 'DesignX India 2024',
        year: '2024',
        icon: '🎖️',
      },
      {
        id: 'a3',
        title: '25+ Verified Student Contributions',
        issuer: 'Club Head Approved Works',
        year: '2026',
        icon: '🛡️',
        desc: 'All contributing members earn official portfolio badges verified on-chain by the president.',
      },
    ],
    sponsors: [
      { name: 'Figma Campus', tier: 'Tool Partner' },
      { name: 'Red Bull India', tier: 'Beverage Partner' },
      { name: 'Wacom India', tier: 'Hardware Sponsor' },
      { name: 'Skillshare', tier: 'Education Partner' },
      { name: 'MSIT Alumni Guild', tier: 'Patron' },
    ],
    socials: {
      instagram: 'https://instagram.com/artikon_msit',
      linkedin: 'https://linkedin.com/company/artikon-msit',
      email: 'artikon.msit@gmail.com',
    },
  },
  arteza: {
    slug: 'arteza',
    name: 'Arteza Creative Hub',
    handle: 'arteza_club',
    tagline: 'Bridging design, tech, and creative entrepreneurship across campus.',
    about:
      'Arteza is an inter-college design and media collective dedicated to building open-source design systems, creative coding experiments, and student portfolio platforms.',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1800&q=80',
    logo: '⚡',
    accent: '#d4ff1f',
    verified: true,
    college: 'Campus Network',
    category: 'Design & Technology',
    since: 2023,
    recruitmentOpen: true,
    recruitmentDeadline: 'Dec 15, 2026',
    openDomains: ['Frontend Design', 'Brand Architecture', 'Community Management'],
    stats: {
      members: 42,
      events: 14,
      registrations: 3100,
      since: 2023,
    },
    whatWeDo: [
      { id: 'w1', title: 'Open Design Tools', icon: '🛠️', desc: 'Authoring community Figma kits and UI boilerplates.' },
      { id: 'w2', title: 'Creative Technology', icon: '💻', desc: 'Exploring shaders, three.js, and interactive web canvases.' },
      { id: 'w3', title: 'Mentorship Circles', icon: '🤝', desc: 'Pairing junior creators with senior industry practitioners.' },
    ],
    portfolio: [
      {
        id: 'p10',
        title: 'Artiverse Design System v2.0',
        category: 'Posters',
        year: '2026',
        event: 'Platform Core',
        media: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        credits: ['Piyush Dawn'],
        description: 'The visual design language and tokens powering the Artiverse campus ecosystem.',
      },
    ],
    events: [
      {
        id: 'ev10',
        title: 'Generative UI Demo Day',
        date: 'Dec 05, 2026',
        time: '5:00 PM IST',
        venue: 'Virtual Amphitheatre',
        status: 'upcoming',
        poster: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
        registrationOpen: true,
        summary: 'Live showcase of generative web components and animated micro-interactions.',
      },
    ],
    council: [
      {
        id: 'c10',
        name: 'Piyush Dawn',
        role: 'Founder & Tech Lead',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        socials: { linkedin: 'https://linkedin.com' },
      },
    ],
    journey: [
      { year: '2023', title: 'Genesis', description: 'Launched as a campus UI guild.' },
      { year: '2026', title: 'Arteza Network', description: 'Powering campus communities across state colleges.' },
    ],
    achievements: [
      { id: 'ac1', title: 'Open Source Community Award', issuer: 'Figma Community', year: '2025', icon: '🌐' },
    ],
    sponsors: [{ name: 'Vercel Campus', tier: 'Cloud Partner' }],
    socials: {
      instagram: 'https://instagram.com/arteza_hub',
      email: 'arteza.creatives@gmail.com',
    },
  },
}

/**
 * Normalise any slug / username (e.g. '@artikon_msit' -> 'artikon')
 */
export function normaliseSlug(input) {
  if (!input) return 'artikon'
  const cleaned = String(input).toLowerCase().trim().replace(/^@+/, '')
  if (cleaned.includes('artikon')) return 'artikon'
  if (cleaned.includes('arteza')) return 'arteza'
  return cleaned.replace(/[^a-z0-9_-]/g, '')
}

/**
 * Retrieve committee by slug or handle with fallback
 */
export function getCommitteeBySlug(slug) {
  const norm = normaliseSlug(slug)
  if (sampleCommittees[norm]) return sampleCommittees[norm]

  // Dynamic fallback for any newly created committee
  const title = norm.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    slug: norm,
    name: title,
    handle: norm,
    tagline: `Official student society for ${title}.`,
    about: `${title} is a dedicated campus organization empowering students through workshops, hackathons, and creative projects.`,
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1800&q=80',
    logo: '🏛️',
    accent: '#d4ff1f',
    verified: true,
    college: 'Campus Network',
    category: 'Student Committee',
    since: 2025,
    recruitmentOpen: true,
    recruitmentDeadline: 'Upcoming',
    openDomains: ['Core Operations', 'Design & Media', 'Events & PR'],
    stats: { members: 12, events: 4, registrations: 420, since: 2025 },
    whatWeDo: [
      { id: '1', title: 'Events & Workshops', icon: '🎪', desc: 'Conducting campus learning sprints and talks.' },
      { id: '2', title: 'Media & Outreach', icon: '📢', desc: 'Building creative content and student engagement.' },
    ],
    portfolio: [
      {
        id: 'pf-fall',
        title: `${title} Launch Key Visual`,
        category: 'Posters',
        year: '2026',
        event: 'Inaugural Showcase',
        media: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        credits: ['Founding Council'],
        description: 'First public identity showcase of the committee.',
      },
    ],
    events: [
      {
        id: 'ev-fall',
        title: `${title} Orientation Meetup`,
        date: 'Dec 12, 2026',
        time: '4:00 PM IST',
        venue: 'Auditorium Hall',
        status: 'upcoming',
        poster: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
        registrationOpen: true,
        summary: 'Meet the council leads and explore upcoming initiatives.',
      },
    ],
    council: [
      {
        id: 'c-fall',
        name: 'Lead Organizer',
        role: 'President & Founder',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        socials: { linkedin: 'https://linkedin.com' },
      },
    ],
    journey: [
      { year: '2025', title: 'Inception', description: 'Established as an official student body.' },
    ],
    achievements: [
      { id: 'ach-1', title: 'Verified Student Society', issuer: 'Campus Guild', year: '2026', icon: '🛡️' },
    ],
    sponsors: [{ name: 'Student Guild', tier: 'Campus Sponsor' }],
    socials: { email: `${norm}@campus.edu` },
  }
}

