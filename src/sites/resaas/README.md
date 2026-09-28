# RESAAS documentation site

Public documentation of the two RESAAS libraries — `django_resaas` (backend) and
`quasar_resaas` (frontend) — served at:

| Host | Served by |
|---|---|
| `resaas.dev.mytech.co.mz` | `quasar dev` (port 9000), through nginx `siteResaas.conf` |
| `resaas.mytech.co.mz` | the built SPA in `/var/www/pro/front/dist/spa` |

It is one of the hostname-routed sites of this app: `src/router/routes.js` maps both hosts
to `resaasSiteRoutes` (`./routes.js`). In development, `?site=resaas` previews it on any
host that already reaches this app (e.g. `https://dev.mytech.co.mz/?site=resaas`).

## Source of truth: the libraries' own docs

The pages are **not written here**. `content/` is a copy of each library's `docs/` folder,
made by `scripts/sync-docs.mjs`:

| Site path | Copied from |
|---|---|
| `content/django-resaas/` | `django_resaas/docs/` (+ `src/dev/README.md` as `example-app.md`) |
| `content/quasar-resaas/` | `quasar_resaas/docs/quasar-resaas/` |
| `content/guide/start-here.md` | written here — the only page owned by the site |
| `content/manifest.js` | generated: sync time and the commit of each library |

To fix or add documentation, edit it **in the library**, then resync:

```bash
cd /var/www/dev/front
node src/sites/resaas/scripts/sync-docs.mjs
# other checkouts: DJANGO_RESAAS_DIR=... QUASAR_RESAAS_DIR=... node src/sites/resaas/scripts/sync-docs.mjs
```

`manifest.js` is a JS module, not JSON: this app's i18n Vite plugin cannot transform
imported `.json` files.

## How it works

- `docs.js` — loads every `content/**/*.md` (`import.meta.glob`), builds each library's
  sidebar **from that library's `README.md`** (its "Navigation" list, in its order; files the
  README does not list are appended), previous/next, search and link resolution.
- `render.js` — markdown → HTML (`marked`) with GitHub-compatible heading ids, a copy button on
  code blocks, GitHub alerts (`> [!NOTE]`, `[!WARNING]`, ...) and link rewriting:
  - relative `*.md` links → pages of this site (the app uses hash routing, so pages navigate
    with the router, not raw hrefs);
  - GitHub URLs into either library's docs → pages of this site too, so a library can link to
    the other one with a URL that also works on GitHub;
  - links to source files or tests → the file on GitHub, in a new tab.
- `pages/DocPage.vue` — `/docs/:product/:slug`; `?a=<heading-id>` scrolls to a heading.
- `pages/HomePage.vue`, `layouts/ResaasLayout.vue` — landing page, header, search (`/` focuses
  it), light/dark toggle (remembered in `localStorage`).

UI strings go through `tdc()`; their pt/es/fr translations are in the backend lang files. The
documentation content itself is English, like the libraries' docs.

## Writing docs that render well here

- Link other pages with relative `.md` paths, headings with GitHub anchors (`#my-heading`).
- Link the other library with its GitHub URL:
  `https://github.com/metanochava/quasar_resaas/blob/main/docs/quasar-resaas/<page>.md`.
- Add new pages to the library's `docs/README.md` navigation so they get a proper sidebar place.

## Troubleshooting

| Symptom | Check |
|---|---|
| "Welcome to nginx!" | Another nginx file declares the same `server_name` (Certbot once wrote these hosts into `default`). `nginx -t` warns `conflicting server name`. Keep the hosts only in `siteResaas.conf`. |
| A page is missing / old | Resync (`sync-docs.mjs`); for `resaas.mytech.co.mz` rebuild the pro frontend. |
| A link shows as plain text | Its target is neither a `.md` in the synced docs nor a file in the library — fix the link in the library. |
| Stuck on "Loading" | A module failed to load: check the browser console / the Vite error for the file. |
