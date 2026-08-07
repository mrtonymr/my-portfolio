# Interview Prep Hub

Offline-first interview preparation platform built with **Angular 20**, signals, Material, Tailwind CSS, SCSS, and Chart.js.

## Live demo

When this repo is deployed to GitHub Pages, the app is available at:

`https://mrtonymr.github.io/my-portfolio/interview-prep-hub/`

## Features

- Dashboard with progress, streak, daily question, and charts
- Question library with search, filters, grid/list views
- **Groq AI questions** — paste your API key in Settings and generate fresh interview questions
- Question details with notes, bookmarks, copy/share
- Bookmarks management
- Flashcards with flip animation and keyboard shortcuts
- Mock interviews with timer, self-rating, and session reports
- Statistics (bar, pie, line, radar)
- Settings: dark mode, animations, Groq key, export/import, reset progress
- LocalStorage persistence — works fully offline for built-in content

## Groq setup

1. Create a key at [console.groq.com](https://console.groq.com/)
2. Open **Settings** in the app
3. Paste the key and click **Save key** (stored only in localStorage)
4. Open **AI Questions** and generate

Never commit API keys to git. If a key was shared publicly, rotate it in the Groq console.
## Scripts

```bash
cd interview-prep-hub
npm install
npm start
npm run build
npm run deploy
```

## Architecture

```text
src/app/
  core/services/     Storage, theme, questions, progress, bookmarks, stats, mock
  features/          Dashboard, questions, bookmarks, flashcards, mock, stats, settings, about
  layout/            App shell (sidebar + topbar)
  shared/            Question card, chart, empty state
  models/            Strongly typed interfaces
  utils/             Date helpers
src/assets/data/     80 interview questions across 10 categories
```

Hash routing is enabled for GitHub Pages. Deploy publishes `dist/interview-prep-hub/browser`.

## Data

Categories: JavaScript, TypeScript, Angular, React, HTML, CSS, NodeJS, SQL, System Design, HR.
