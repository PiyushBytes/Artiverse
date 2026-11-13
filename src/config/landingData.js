export { heroContent, heroMockupData } from './heroData'

export const eventNames = ['Campus Conclave', 'Clashpoint', 'Act It Out', 'Annual Cultural Fest', 'Tech Summit']

export const heroNotifications = [
  { eyebrow: 'EVENT REGISTRATION', message: 'Campus Festival · Participant registered · Pass active', icon: 'ticket', time: 'now' },
  { eyebrow: 'COMMITTEE JOIN', message: 'Campus Committee · Roster registered in one click', icon: 'people', time: '1m ago' },
  { eyebrow: 'RECRUITMENT', message: 'You have been shortlisted for your interview', icon: 'spark', time: '2m ago' },
]

export const productDetails = {
  events: [
    'Event pages with registration and UPI ticketing',
    'QR entry valid once per pass',
    'Sponsor branding on tickets',
    'Post-event report',
  ],
  committees: [
    'Roles for President, VP, GS, Joint Secretary, Treasurer and POCs',
    'Send an event to every member',
    'Register the whole committee in one click',
    'Attendance and certificates automatically',
  ],
}

export const stepsByProduct = {
  Events: ['Create the event', 'Open registration', 'Scan at the gate', 'Report to sponsors'],
  Committees: ['Set up the committee', 'Share an event', 'Register together', 'Track and certify'],
}

export const impactStats = [
  { value: 240, suffix: '+', label: 'applications this cycle' },
  { value: 20, suffix: '', label: 'events managed' },
  { value: 2025, suffix: '', label: 'founded on campus' },
]

export const landingFaqs = [
  { question: 'Who is Artiverse for?', answer: 'Artiverse is built for the event managers, committee coordinators and student members who make campus culture happen.' },
  { question: 'How do event tickets and entry work?', answer: 'Publish an event with registration and UPI ticketing, then scan each pass at the gate. Each QR pass is valid once.' },
  { question: 'Can a full committee register together?', answer: 'Yes. Coordinators can share an event with the committee and register members together in one click.' },
  { question: 'What can committees manage on the platform?', answer: 'Set roles for the President, VP, GS, Joint Secretary, Treasurer and POCs, then track attendance and certificates.' },
]
