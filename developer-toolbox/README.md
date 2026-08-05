# Developer Toolbox

Browser-only developer utilities inspired by DevToys and modern tooling sites.

Built with **Angular 20**, standalone components, signals, SCSS, and Angular Material.

## Live demo

When this repo is deployed to GitHub Pages, the app is available at:

`https://mrtonymr.github.io/my-portfolio/developer-toolbox/`

## Tools

- JSON Formatter
- Base64 Encoder / Decoder
- JWT Decoder (local only)
- UUID Generator
- Timestamp Converter
- URL Encoder / Decoder
- Color Picker
- Regex Tester
- Regex AI (optional Groq API)

## Scripts

```bash
cd developer-toolbox
npm install
npm start
npm run build
npm test
```

- `npm start` — local development server
- `npm run build` — production build with relative `base-href`
- Root GitHub Actions workflow builds this app and publishes it under `/developer-toolbox/` on Pages

## Architecture

```text
src/app/
  core/services/     Theme, clipboard, storage, download, domain tools, Groq
  shared/components/ Tool header, cards, code panels
  layout/            Responsive shell with sidenav + navbar
  pages/             Lazy-loaded feature pages
  models/            Tool catalog
  utils/             Small helpers
```

Routing uses `HashLocationStrategy` so the app works on GitHub Pages without server rewrites.

## Regex AI setup

Add your Groq key to:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

```ts
groqApiKey: 'your-key-here',
```

The key stays in the frontend bundle. Use a restricted key and rotate it if needed.

## Notes

- No backend, auth, or database
- All processing runs in the browser
- Dark mode and recent tools are stored in `localStorage`
