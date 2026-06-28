# StudyFlow Orbit 🪐

Your AI-powered student cockpit — timetable, focus timer, notes, exam tracker,
growth charts, and an AI study coach, in one offline-first app.

This is the production-grade rebuild of the original single-file prototype:
a feature-first React + TypeScript app on Vite, with full CI/CD, linting,
and test tooling.

## Features

- **Dashboard** — today's blocks, Perfect Day progress, weekly stats, mini charts, Quick AI
- **Timetable** — weekly schedule with categories, subjects, search, and inline editing
- **Growth Charts** — study-hour trend, subject balance, completion rate, balance radar, 28-day heatmap
- **AI Studio** — chat with a Claude-powered study coach, with quick-tip prompts
- **Notes Hub** — tagged, searchable revision notes
- **Exam Sprint** — countdown + syllabus checklist with progress bar
- **Focus Room** — Pomodoro-style timer that logs sessions and earns sparks
- **Night Review** — two-minute daily reflection with mood tracking and history
- **Perfect Day** — a daily streak mechanic (80%+ blocks + a focus session + a review + a claimed spark)

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run static analysis (oxlint) |
| `npm test` | Run unit tests once (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |

## Architecture

Feature-first, with shared building blocks separated out — see
[CONTRIBUTING.md](./CONTRIBUTING.md) for the full layout and conventions.

```
src/
├── assets/        Design tokens, global stylesheet, fonts, images
├── components/     Reusable UI (Button, InputField) + app shell (Sidebar, Topbar, Modal, Toast, A11yPanel)
├── features/       One folder per feature, each with api/ · hooks/ · views/
├── store/          AppStore (state + reducer + persistence) and DayContext
├── types/          Shared TypeScript types
└── utils/          Pure helpers (formatters, validators)
```

### State & persistence

App state lives in a single reducer (`src/store/reducer.ts`), persisted to
`localStorage` on every change. Cross-device sync is a pluggable interface
(`src/store/persistence.ts`) — see that file for why the original sandbox's
`window.storage` doesn't carry over, and how to wire up a real backend
(Firebase example included).

### AI Studio & the API key

The AI coach calls a backend proxy rather than `api.anthropic.com` directly —
see `src/features/ai-studio/api/claudeClient.ts` for why (short version: a
real API key can never be shipped to browser JS safely). Set
`VITE_AI_PROXY_URL` in a local `.env` once you have a proxy deployed.

## Deployment

Pushing to `main` runs the `Test & Validate` workflow, then
`Deploy to GitHub Pages` builds and publishes `dist/` automatically (see
`.github/workflows/`). Enable GitHub Pages → "GitHub Actions" as the source
in your repo settings to turn this on.

## License

MIT — see [LICENSE](./LICENSE).
