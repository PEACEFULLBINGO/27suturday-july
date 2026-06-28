# Contributing to StudyFlow Orbit

Thanks for helping improve StudyFlow Orbit! This guide covers local setup,
project conventions, and how to submit changes.

## Local setup

```bash
git clone https://github.com/<your-org>/studyflow-orbit.git
cd studyflow-orbit
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

## Project structure

This is a feature-first React + TypeScript app built with Vite:

```
src/
├── assets/        Images, fonts, and global stylesheets
├── components/    Reusable, app-agnostic UI building blocks (Button, InputField…)
├── features/      One folder per product feature (dashboard, timetable, …),
│                  each with its own api/ (data access), hooks/ (state & logic),
│                  and views/ (presentational components)
├── store/         App-wide state (AppStore) and local persistence
├── types/         Shared TypeScript types
└── utils/         Pure helper functions (formatters, validators)
```

When adding a new feature, follow the existing pattern: put data fetching in
`api/`, stateful logic in `hooks/`, and JSX in `views/`. Keep `views/`
components "dumb" — they should render props and call callbacks, not reach
into global state directly.

## Environment variables

The AI Studio feature calls Claude through a backend proxy (see
`src/features/ai-studio/api/claudeClient.ts` for why a proxy is required —
in short, an API key can never be safely shipped to the browser). Configure
the proxy URL in a local `.env` file:

```
VITE_AI_PROXY_URL=https://your-backend.example.com/api/chat
```

## Before committing

A pre-commit hook (via Husky + lint-staged) runs the linter on staged files
automatically. You can also run checks manually:

```bash
npm run lint     # static analysis
npm run build    # type-check + production build
npm test         # unit tests
```

## Submitting changes

1. Create a branch off `main`: `git checkout -b feature/short-description`.
2. Make your changes with focused, descriptive commits.
3. Open a pull request — the `Test & Validate` workflow must pass before merge.
4. Describe what changed and why in the PR description; link any related issue.

## Reporting bugs / requesting features

Please use the issue templates under `.github/ISSUE_TEMPLATE/` so reports
include the information maintainers need to act on them.
