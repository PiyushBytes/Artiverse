# Artiverse Recruitment Website

A responsive React + Vite + Tailwind CSS v4 recruitment landing page.

## Requirements
- Node.js LTS
- npm

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```
On Windows PowerShell, create `.env` manually by copying `.env.example`.
Open the local URL printed by Vite (normally http://localhost:5173).

## Configure
Edit `src/config/siteConfig.js` for dates, stats, domains, FAQs and social links.
Add your dark creative hero image at `public/hero.webp`.
Set these values in `.env`:
- `VITE_SHEET_WEBHOOK_URL`: deployed Google Apps Script `/exec` URL
- `VITE_BOOKING_URL`: public Cal.com / appointment booking URL

Restart `npm run dev` after changing `.env`.

## Google Sheets
1. Create a Google Sheet.
2. Open Extensions > Apps Script.
3. Paste `google-apps-script/Code.gs`.
4. Save, then Deploy > New deployment > Web app.
5. Execute as: Me. Who has access: Anyone.
6. Deploy, authorize, and copy the `/exec` URL into `.env`.

The script stores submissions in a sheet named `Applications` and rejects duplicate college email addresses. Test browser submission after deployment; Apps Script redirects/CORS behavior can vary by browser/account.

## Production build
```bash
npm run build
npm run preview
```
Deploy to Vercel by importing the GitHub repository. Framework: Vite; build command: `npm run build`; output directory: `dist`. Add both environment variables in Vercel project settings and redeploy.

## Launch checklist
- [ ] Replace application deadline and PI dates in siteConfig.js
- [ ] Confirm event count, domains count and founded year
- [ ] Add `public/hero.webp`
- [ ] Add Google Apps Script URL to `.env` / Vercel
- [ ] Add PI booking URL to `.env` / Vercel
- [ ] Replace Instagram, LinkedIn and contact email
- [ ] Review privacy notice and limit spreadsheet access
- [ ] Test invalid form, successful form, duplicate email and mobile layout
