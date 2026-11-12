# Artiverse Frontend Architecture & Documentation

Welcome to the **Artiverse** production frontend codebase. This document is an enterprise-grade guide explaining the architecture, directory layout, component decomposition, data flow, and developer conventions across the application.

---

## 1. Architectural Philosophy

The Artiverse frontend is engineered according to modern production standards:
- **Feature-Based Modular Decomposition:** Large monolithic files are eliminated. Every feature and section lives in its own dedicated directory containing small, single-responsibility components (each typically under 100 lines).
- **Centralized Barrel Exports:** `src/components/index.js` provides clean, standardized imports so parent views and routers do not suffer from deep path coupling.
- **Strict Separation of Concerns:**
  - `src/api/` handles HTTP calls, headers, session persistence, and API error normalization.
  - `src/config/` houses static copy, mock data, landing content, and event metadata.
  - `src/components/` is partitioned into feature folders (`navbar/`, `hero/`, `auth/`, `apply/`, `events/`, etc.) and `common/` primitives.
  - `src/hooks/` provides reusable stateful logic (scroll tracking, countdowns, responsive observers).
- **Accessible & Performance-Minded Motion:** Powered by `motion/react` with native `useReducedMotion()` checks across all animated nodes. GPU-accelerated transforms (`transform`, `opacity`) are prioritized with `will-change` hints on heavy visual clusters.

---

## 2. Directory Structure Map ("Where is What?")

```
d:/Projects/arteza website/arteza-website/
├── docs/
│   └── FRONTEND_ARCHITECTURE.md        # Comprehensive architecture & module guide (this file)
├── public/
│   ├── events/                         # Event poster graphics & promotional banners
│   ├── favicon.svg                     # Site brand icon
│   └── icons.svg                       # Vector sprites & brand assets
├── src/
│   ├── api/
│   │   └── auth.js                     # Django backend API client, OTP/PIN auth & session management
│   ├── config/
│   │   ├── events.js                   # Events showcase database (dates, tags, posters, links)
│   │   ├── heroData.js                 # Hero copy, 3 role datasets (Student/Committee/Organiser), mockups
│   │   ├── landingData.js              # Products, workflows, statistics, FAQ copy
│   │   └── siteConfig.js               # Club metadata, recruitment deadlines, social links, domains
│   ├── hooks/
│   │   ├── index.js                    # Custom hooks barrel export
│   │   └── useCountdown.js             # High-accuracy recruitment countdown hook
│   ├── lib/
│   │   └── submitApplication.js        # Google Sheets Apps Script submission client & honeypot defense
│   ├── pages/                          # Dedicated full-page route views
│   │   ├── CommitteesPage.jsx          # /committees - Filterable college clubs directory & open recruitments
│   │   ├── HowItWorksPage.jsx          # /how-it-works - Interactive student, committee & organiser workflows
│   │   ├── AboutPage.jsx               # /about - Artiverse mission, pillars, and MSIT Kolkata story
│   │   ├── RegistrationsPage.jsx       # /registrations - Event passes, single-use QR passes & application status
│   │   ├── ProfilePage.jsx             # /profile - User info, college, year of study, portfolio link
│   │   ├── SettingsPage.jsx            # /settings - Notification preferences, connect.arteza@gmail.com alerts, PIN
│   │   ├── ContactPage.jsx             # /contact - WhatsApp (+91 75342 33233), email & campus support form
│   │   ├── SearchPage.jsx              # /search - Unified search engine across clubs, events, colleges
│   │   └── index.js                    # Pages barrel export
│   ├── components/
│   │   ├── index.js                    # Master component barrel export
│   │   ├── common/                     # Reusable UI primitives
│   │   │   ├── AvatarStack.jsx         # Compact multi-avatar overlapping stack
│   │   │   ├── MagneticButton.jsx      # Magnetic physics cursor-following button
│   │   │   ├── Reveal.jsx              # Viewport-triggered scroll reveal container
│   │   │   ├── Toast.jsx               # Floating toast notifications
│   │   │   └── index.js                # Common primitives barrel export
│   │   ├── navbar/                     # Navigation header module
│   │   │   ├── NavBrand.jsx            # Artiverse logo + status dot
│   │   │   ├── NavLinks.jsx            # Desktop nav anchor items (Logged Out vs Logged In)
│   │   │   ├── NavActions.jsx          # Lime "Log in" button vs Notifications badge + Profile dropdown
│   │   │   ├── MobileMenu.jsx          # Collapsible responsive mobile drawer
│   │   │   └── index.jsx               # Floating sticky 64px pill navbar with scroll hiding
│   │   ├── dock/                       # Desktop floating 4-button vertical side dock (positioned on left)
│   │   │   ├── SideDock.jsx            # 4-button dock on left edge (Logged Out: Register, Student, Search, Contact)
│   │   │   │                           # (Logged In: Dashboard, Search, Notifications, Contact)
│   │   │   ├── SearchModal.jsx         # Fast college & committee directory lookup modal
│   │   │   ├── NotificationsDrawer.jsx # Notification center drawer with badge counts
│   │   │   ├── ContactModal.jsx        # Direct WhatsApp and Email modal
│   │   │   └── index.js                # Dock barrel export
│   │   ├── mobile/                     # Dedicated Mobile View architecture
│   │   │   ├── MobileNavbar.jsx        # Mobile top bar (Logo, Login/Avatar, Hamburger)
│   │   │   ├── MobileBottomBar.jsx     # Touch-friendly bottom bar (4 items with safe-area padding)
│   │   │   ├── MobileProfileSheet.jsx  # Slide-up user sheet (Profile, Settings, Log out)
│   │   │   └── index.jsx               # Mobile layout coordinator
│   │   ├── dashboard/                  # Unified role-tailored user hub
│   │   │   ├── StudentDashboard.jsx    # Joined committees, PI requests, event registrations
│   │   │   ├── LeadDashboard.jsx       # Committee roster, applicant review, "Invite committee" lime CTA
│   │   │   └── index.jsx               # Role-based dashboard router
│   │   ├── hero/                       # Hero section module
│   │   │   ├── HeroHeadline.jsx        # 3-line headline with line masks & lower-35% lime highlighter
│   │   │   ├── HeroActions.jsx         # "Get started" (dark ink) and "See how it works" CTAs
│   │   │   ├── HeroProof.jsx           # AvatarStack + live real-time incrementing students counter
│   │   │   ├── RoleSwitcher.jsx        # Segmented pill selector (Student | Committee | Organiser)
│   │   │   ├── phone/                  # Smartphone interactive device mockup
│   │   │   │   ├── PhoneDevice.jsx     # Realistic chassis, bezel, side buttons, glass gloss sheen
│   │   │   │   ├── PhoneScreen.jsx     # Dynamic Island, clock, role notifications, lock-screen widgets
│   │   │   │   ├── VerifiedCard.jsx    # Protruding "Entry verified" pill card
│   │   │   │   └── index.jsx           # Phone mockup cluster with spring mouse parallax
│   │   │   └── index.jsx               # Hero section container & responsive grid
│   │   ├── marquee/
│   │   │   └── index.jsx               # Infinite marquee ticker with events + "Built at MSIT, Kolkata"
│   │   ├── products/
│   │   │   ├── ProductCard.jsx         # Two-sided campus feature card (Events vs Committees)
│   │   │   └── index.jsx               # Products section container
│   │   ├── how-it-works/
│   │   │   ├── ProcessStepCard.jsx     # Individual workflow step card
│   │   │   └── index.jsx               # Interactive GSAP pinned stepper + tab switcher
│   │   ├── stats/
│   │   │   ├── StatCard.jsx            # Animated numeric counter card
│   │   │   └── index.jsx               # Impact statistics section
│   │   ├── faq/
│   │   │   ├── FAQItem.jsx             # Accessible collapsible accordion item
│   │   │   └── index.jsx               # FAQ section container
│   │   ├── cta/
│   │   │   └── index.jsx               # Bottom dark ink call-to-action recruitment card
│   │   ├── footer/
│   │   │   └── index.jsx               # Clean footer with copyright, links, and contact email
│   │   ├── auth/                       # Authentication & onboarding flow module
│   │   │   ├── AuthHeader.jsx          # Back to Home, Artiverse Community, and Secure Portal badge
│   │   │   ├── AuthHero.jsx            # Left branding column, value proposition, perks, demo fill
│   │   │   ├── LoginForm.jsx           # Mobile / Email sign-in identifier input
│   │   │   ├── RegisterForm.jsx        # First name, last name, email, phone, 4-digit PIN form
│   │   │   ├── OtpPinForm.jsx          # 4-digit PIN or 6-digit email OTP verification input
│   │   │   └── index.jsx               # Auth state coordinator & API integration
│   │   ├── apply/                      # Recruitment application flow module
│   │   │   ├── ApplySidebar.jsx        # Left column with deadlines, perks, and domain badges
│   │   │   ├── ApplyStepper.jsx        # 3-step progress bar (About You, Academics, Creative Side)
│   │   │   ├── StepFields.jsx          # StepPersonal, StepAcademic, StepCreative form inputs
│   │   │   ├── ApplySuccess.jsx        # Application confirmed state with Cal.com PI slot booking
│   │   │   └── index.jsx               # Apply stepper container & validation logic
│   │   └── events/                     # Events discovery & booking module
│   │       ├── PosterArtwork.jsx       # Event poster graphic renderer with CSS orbit fallback
│   │       ├── StatusPill.jsx          # Live/Open/Soon/Ended badge
│   │       ├── EventCard.jsx           # Snap-carousel & grid event card with favorite toggle
│   │       ├── EventDrawer.jsx         # Right modal drawer with event schedule, venue, registration
│   │       └── index.jsx               # Events explorer with category pills and search filter
│   ├── App.jsx                         # Application root, routing dispatcher, Lenis smooth scroll
│   ├── index.css                       # Tailwind CSS v4 design tokens, theme variables, base styles
│   └── main.jsx                        # React 19 entry point
├── index.html                          # HTML shell with Google Fonts preload (Playfair Display + Inter)
├── package.json                        # Dependencies, build scripts
├── vite.config.js                      # Vite bundler configuration & local API reverse proxy
└── vercel.json                         # Vercel deployment routes & SPA rewrites
```

---

## 3. Core Feature Modules

### 3.1 Navbar (`src/components/navbar/`)
- **Container (`index.jsx`):** Floating pill navbar with `max-w-[1200px]`, `h-16` (64px height), `top-4` and `mt-4`. Uses `motion.header` with directional scroll tracking to smoothly hide when scrolling down and reappear when scrolling up.
- **Brand (`NavBrand.jsx`):** Renders the `#d4ff1f` lime glowing dot and title.
- **Actions (`NavActions.jsx`):** Renders the lime `#d4ff1f` Log In button for unauthenticated users, or the member's first name and Sign Out button for authenticated sessions.

### 3.2 Hero (`src/components/hero/`)
- **Headline (`HeroHeadline.jsx`):** Renders three strictly controlled lines:
  1. *"Run campus events"*
  2. *"and committees"*
  3. *"in one place."* (Playfair Display italic + continuous `#d4ff1f` lime highlighter on the lower 35% of the line).
  - Each line uses an overflow-hidden mask with inline padding (`padding: 0 .14em .12em 0; margin-right: -.14em;`) preventing glyph clipping.
- **Live Counter (`HeroProof.jsx`):** Avatar group with a real-time ticking counter (`312+ students applied this cycle`) that periodically increments.
- **Role Switcher (`RoleSwitcher.jsx`):** Interactive segmented toggle (`Student` | `Committee` | `Organiser`) with a sliding spring pill (`layoutId="roleTogglePill"`).
- **Phone Mockup (`hero/phone/`):**
  - Standard dimensions: `248px x 504px`.
  - Realistic device bezel, volume/power buttons, and glass sheen.
  - Interactive lock screen with Dynamic Island, clock (`1:47`), 3 role-specific glassmorphism notifications, "Next: Kalakriti'26" widget, and camera/flashlight shortcuts.
  - Protruding *"Entry verified"* card positioned relative to the phone (`bottom: 14%`, `left: -54px`).
  - Smooth desktop mouse parallax with reduced-motion protection.

### 3.3 Auth Flow (`src/components/auth/`)
- **Architecture:** Zero-reload SPA authentication coordinating with the Django backend.
- **Routes:**
  - `/login`: Form for Mobile / Email. If valid, transitions to `step === 'pin'` for 4-digit security PIN verification.
  - `/register`: Registration form (first name, last name, email, 10-digit mobile, 4-digit PIN, newsletter consent). On submission, calls `POST av/accounts/create-profile/` and transitions to `step === 'otp'` for 6-digit email OTP verification.
- **Security:** Honeypot field protection, input sanitization, and persistent session storage in `localStorage`.

### 3.4 Recruitment Application (`src/components/apply/`)
- **Stepper (`apply/index.jsx`):**
  - Step 1 (`StepPersonal`): Full name, College email, WhatsApp/Phone.
  - Step 2 (`StepAcademic`): Roll number, Department, Year.
  - Step 3 (`StepCreative`): Primary domain, Secondary domain, "Why Artiverse" statement, Portfolio link.
- **Submission (`lib/submitApplication.js`):** Posts application payload to the Google Apps Script webhook (`VITE_SHEET_WEBHOOK_URL`), sets local storage lock, and transitions to `ApplySuccess` with appointment booking.

### 3.5 Events Explorer (`src/components/events/`)
- Filterable showcase of all campus festivals and workshops.
- Real-time search by title, tags, or venue.
- Category filtering (`All`, `Design`, `Film`, `Literary`, etc.) and timeline tabs (`All`, `Upcoming`, `Past`).
- Deep modal details drawer (`EventDrawer.jsx`) showing schedules, venues, and registration links.

---

## 4. Design System & Styling Conventions

- **Colors:**
  - Ink (Primary Dark): `#0d0f08`
  - Lime (Vibrant Accent): `#d4ff1f` (RGB: `212, 255, 31`)
  - Off-white (Background/Card): `#ffffff`, `#f6f7f2`
  - Card Borders: `#e4e6da`, `#dfe1d3`
  - Muted Text: `#5e6355`, `#73786a`
- **Typography:**
  - Display Font: `"Playfair Display", Georgia, serif`
  - Body Font: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **8px Spacing Grid:** Margins and paddings adhere strictly to multiples of 8px (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`).

---

## 5. Adding New Components (Developer Guide)

When adding a new feature section:
1. Create a dedicated folder in `src/components/<feature-name>/`.
2. Break the feature into sub-components (`<Feature>Card.jsx`, `<Feature>Header.jsx`, etc.).
3. Export the main container as default from `src/components/<feature-name>/index.jsx`.
4. Add the component export to `src/components/index.js`.
5. Mount it in `src/App.jsx`.
6. Run `npm run build` to verify tree-shaking and zero compilation warnings.

---

*Authored for the Artiverse development team. Maintained at MSIT, Kolkata.*

