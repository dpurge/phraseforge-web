# PhraseForge Web

PhraseForge is a TypeScript Docusaurus site for language-learning lessons.
Polish is the default locale, and English translations live under `i18n/en/`.

## Commands

```bash
npm install
```

Install dependencies from `package-lock.json`.

```bash
npm run dev:pl
npm run dev:en
```

Start hot-reload development for one locale. Docusaurus development mode serves
one locale at a time, so the language switcher is limited in this mode.

```bash
npm run start
```

Build the site and serve all locales locally with `docusaurus serve --build`.
Use this when checking the language switcher.

```bash
npm run build
npm run serve
```

Generate the production static site in `build/`, then serve that generated
output locally.

```bash
npm run typecheck
npm run clear
```

Run TypeScript checks, or clear Docusaurus caches when routes or generated
metadata look stale.

## Lesson Authoring

Default Polish lessons live in:

```text
docs/{iso-639-3}/{cefr}/YYYY-MM-DD-a.mdx
```

English translations live in:

```text
i18n/en/docusaurus-plugin-content-docs/current/{iso-639-3}/{cefr}/YYYY-MM-DD-a.mdx
```

Use same-day sequence letters when publishing multiple lessons on one date, for
example `2026-06-01-a.mdx` and `2026-06-01-b.mdx`.

Each lesson needs front matter with `title` and a one-sentence `description`.
The description is used as the goal on generated level index pages.

Do not edit generated output in `build/`, `.docusaurus/`, or `node_modules/`.
Those directories are overwritten or installed by tooling.

## Lesson Elements

Use fenced lesson blocks for structured lesson sections. Do not use XML-like
tags such as `<vocabulary>`, because MDX parses `{...}` as JavaScript inside
those tags.

````mdx
```lesson-vocabulary lang=arb script=arab
درس اللغة العربية {N m sg} [Dars al-luġah al-ʿarabīyah] = lekcja języka arabskiego
```

```lesson-text lang=arb script=arab
أهلاً بكم في درس اليوم!
```

```lesson-exercise lang=arb script=arab
1.  درس اللغة العربية
2.  أخبار مهمة
```
````

Supported block names are `lesson-text`, `lesson-transcription`,
`lesson-translation`, `lesson-vocabulary`, `lesson-models`, and
`lesson-exercise`.

In `lesson-vocabulary` and `lesson-models`, use `=` only as the source
separator between the phrase and translation. It is required in the MDX source
but is not displayed on the rendered page.

Supported `script` values are `latn`, `cyrl`, `grek`, `arab`, `hans`, `hant`,
`hebr`, `kore`, `jpan`, `armn`, `geor`, `syrc`, and `mong`. Text using `latn`,
`cyrl`, or `grek` renders at normal size. The other supported scripts render
source-language text at 160% for readability. `arab`, `hebr`, and `syrc` render
right-to-left; `mong` uses vertical layout.

Exercise blocks may mix instructions in Polish or English with target-language
prompts. The renderer detects non-Latin script runs inside exercises and only
enlarges those runs, so answer choices such as `a. Nie wskazali lokalizacji.`
stay at normal size.

## Validation

Run these before handing off changes:

```bash
npm run typecheck
npm run build
```

Docusaurus may print an update-check permission warning for `~/.config`. If the
static files are generated successfully, that warning is not a project build
failure.

## Deployment

GitHub Pages deployment is handled by `.github/workflows/deploy-pages.yml`.
The workflow runs on every push to `main` and can also be started manually from
the GitHub Actions tab.

The workflow:

1. Installs dependencies with `npm ci`.
2. Runs `npm run typecheck`.
3. Runs `npm run build`.
4. Uploads the generated `build/` directory as a Pages artifact.
5. Publishes the artifact with GitHub Pages.

In the GitHub repository settings, set `Settings -> Pages -> Build and
deployment -> Source` to `GitHub Actions`.

Before publishing, make sure `docusaurus.config.ts` has the correct production
`url` and `baseUrl`. For a project Pages URL such as
`https://phraseforge.github.io/phraseforge-web/`, use the GitHub Pages origin as
`url` and `baseUrl: '/phraseforge-web/'`. For a custom domain or user/organization
site served from the root, keep `baseUrl: '/'`.
