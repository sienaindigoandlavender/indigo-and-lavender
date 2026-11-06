# indigoandlavender.love — notes for Claude

The neutral guest site (Jacqueline, 6 Nov 2026). Airbnb guests must never see "Riad di Siena": their arrival links live here.

- `/` is only a password box (`SITE_PASSWORD` in Vercel; unset = nothing opens). A curious visitor sees nothing else.
- `/welcome?b=- `/the-riad/directions` (No. 37)k=` (the guest's signed link; data from the house's `/api/welcome-data`). `/arrival` and `/keys` are linked from it but not built yet.
- `/the-riad/directions` (No. 37), `/the-riad/transfer`, `/the-riad/dinners`; `/the-douaria/directions` (No. 35), `/the-douaria/transfer`.
- Data comes from the main site's API server-side (`lib/upstream.ts`, `UPSTREAM_URL`); `neutral()` strips the old name and links from every response. The browser never calls riaddisiena.com.
- Never "Riad di Siena", never riaddisiena.com, never a link to another brand (Slow Morocco, Zfriti, Dance with Lions…). Signed Jacqueline, Zahra and Mouad.
- noindex everywhere (robots, X-Robots-Tag).

## House rules (every site)
- Text is never light grey: ink at full strength; smaller, never paler.
- Square corners everywhere; only true circles stay round.
- Forms: single underline fields, transparent.
- Dates with the house calendar (`components/DatePicker.tsx`), never a browser date input.
- No visible scrollbars.
