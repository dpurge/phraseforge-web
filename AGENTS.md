# Repository Guidelines

## Project Structure & Module Organization

This repository is a TypeScript Docusaurus site for PhraseForge language-learning lessons. Polish is the primary locale in `docs/` and `blog/`; English translations live under `i18n/en/`. Lesson content is organized as `docs/{iso-639-3-code}/{cefr-level}/`. React page code, if needed, belongs in `src/pages/`, reusable components in `src/components/`, and global styling in `src/css/custom.css`. Static assets such as logos and social images belong in `static/img/`. Generated output and caches, including `build/`, `.docusaurus/`, and `node_modules/`, should not be committed.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run start`: start the Docusaurus development server.
- `npm run build`: generate the production static site in `build/`.
- `npm run serve`: serve the generated production build locally.
- `npm run typecheck`: run TypeScript checks with `tsc`.
- `npm run clear`: clear Docusaurus caches if routes or generated metadata look stale.

## Coding Style & Naming Conventions

Use TypeScript for React code and Docusaurus config. Keep indentation at two spaces, match the existing single-quote style, and prefer concise, typed React components. Name lesson files by publication date and same-day sequence, for example `2026-06-01-a.mdx`, `2026-06-01-b.mdx`, and keep them under a valid language and CEFR level such as `docs/spa/b1/`. Lesson front matter must include `title` and a one-sentence `description` used as the goal on level index pages. Add matching English content under `i18n/en/docusaurus-plugin-content-docs/current/`. Prefer short MDX pages with clear headings, tables for phrase sets, and ordered lists for practice steps.

## Testing Guidelines

There is no dedicated test framework configured yet. Treat `npm run typecheck` and `npm run build` as required validation before handing off changes. The build is especially important because it validates MDX, sidebars, routes, and broken links. When adding interactive React behavior later, add focused component or end-to-end tests before relying on manual checks.

## Commit & Pull Request Guidelines

No Git history is present in this directory, so use clear imperative commit messages such as `Add lesson template` or `Update Docusaurus branding`. Pull requests should include a short summary, changed content areas, validation commands run, and screenshots for visible UI changes. Link related issues when available and call out any skipped checks.

## Security & Configuration Tips

Do not commit secrets, local environment files, or generated deployment output. Keep production URL, deployment organization, and project name in `docusaurus.config.ts` accurate before publishing.
