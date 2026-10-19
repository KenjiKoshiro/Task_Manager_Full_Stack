# TaskFlow

React + TypeScript + Vite task manager with an Express/MongoDB API.

## Run locally

Use Node 22.12 or newer. Run `npm ci`, copy `.env.example` to `.env`, and set
`MONGODB_URI` and `JWT_SECRET` privately. Never commit credentials. Run
`npm run dev:server` and `npm run dev:client` in separate terminals. Vite proxies
`/api` to the local API on port 3001. For Vercel, configure `VITE_API_BASE_URL`
to the deployed API and set `FRONTEND_URL` on the backend to the exact site origin.
The API requires MongoDB and must be deployed separately from Vercel's static output.

## Maintenance - 19 October 2026

- Persist and validate optional `dueDate` (YYYY-MM-DD or null) and `tag` (max 50
  characters) through create/update, database model, API responses, and UI.
- Calendar shows due dates, not creation dates. Its pending deadlines are real
  task records; placeholder analytics were removed from that page.
- Task search includes title, description and tag; combine status/priority
  filters, reset, board/list views, edit forms, and keyboard status controls.
- Native modal dialog provides focus trapping, Escape and associated labels.
  Failed saves retain input; task deletion asks for confirmation.
- Requests time out after 60 seconds, report recoverable errors, and reject
  malformed responses. Temporary outages preserve the stored token, but the
  session remains unverified until the server accepts it. Only 401 removes it.
- Logout clears previously loaded task data. Mobile navigation and account
  controls have accessible labels. New Task opens a form rather than silently
  creating an unwanted record.
- Team and settings screens are explicitly design previews; unsupported actions
  are disabled. Dashboard activity charts remain illustrative and are labelled.
- TypeScript now runs during production builds. Compatible dependency repairs
  and a React Router security upgrade are included.

## Verification

Run `npm test`, `npm run typecheck`, and `npm run build`. Tests cover task
validation, API payloads, session recovery, and actual Express route handling
with an in-memory model fixture. Browser testing uses
`node tests/browser-fixture.cjs` on localhost:3001 only, plus the Vite frontend.
Fixtures never connect to a database and must not be deployed as the API.
These checks do not prove that the hosted MongoDB/Render configuration works.

The hosted API health check timed out during this maintenance review. Live
registration, sign-in, and database persistence require separate hosted checks.
`npm audit --omit=dev` reports zero production vulnerabilities after repairs.
Development-only advisories remain in Tailwind 3 and nodemon transitive tooling;
no forced framework migration is included in this repair.
