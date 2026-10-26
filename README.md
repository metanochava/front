# Quasar App (front)

A Quasar Project

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Run the tests

```bash
npm test
```

vitest (`vitest.config.js` mirrors the aliases and auto-imports of `quasar.config.js`):
`src/router/routes.spec.js` checks which route table each domain gets, that every table ends in a
catch-all, that route names are unique and that every lazily loaded page of the app resolves;
`src/pages/index.spec.js` checks the registration of the EntityType sites (`src/pages/<type>/site.js` and, when the type has its own site, `src/pages/<type>/SitePage.vue`).

### Environment

Everything in `.env` that `quasar.config.js` passes to `build.env` is compiled into the public
JavaScript bundle. Put no secret there. `FRONT_END_KEY` / `FRONT_END_PASSWORD` identify this
client to the backend (`FEK`/`FEP` headers) and are readable by anyone who opens the site; they
grant no permission by themselves. The architecture of the four repositories is described in
`back/docs/architecture/ecosystem.md`.

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

`quasar build` first empties `dist/spa`, which the web server serves for the dev sites; an
interrupted build leaves them without a site. To only validate a build, write it elsewhere:

```bash
QUASAR_DIST_DIR=/tmp/front-build npm run build
```

### Installable app (PWA)

The front can run as a PWA (Quasar PWA mode, Workbox `GenerateSW`): the same site, at the same
address, works in the browser and can be installed on a phone or a computer (Chrome/Edge
"Install app"; iPhone: Safari > Share > Add to Home Screen).

```bash
make dev        # quasar dev -m pwa   (make dev-spa: the plain SPA)
make build-pwa  # quasar build -m pwa -> dist/pwa
```

- `src-pwa/manifest.json`: name, colours and icons (`public/icons/`, made from the MyTech logo;
  the maskable ones keep the logo inside the 80% safe zone).
- Name per domain (`src/boot/pwa_manifest.js`): on an EntityType's host (farmacia.<domain>,
  saude.<domain>...) the manifest is the backend's `GET django_resaas/entitytypes/manifest/`
  (the type's label, colour and icon - django_resaas docs, *Public sites*); other hosts keep
  "Mytech App". The name is read when the app is installed: reinstall to see a new one.
- Cache: only the app shell (js, css, html, images, woff2 fonts) is precached. The API is another
  origin and has no runtime route in the service worker, so API answers (clinical and tenant
  data) are never stored by it. Offline, the app opens but has no data.
- Updates apply by themselves at a safe moment (`src-pwa/update-policy.js`): the new version
  downloads in the background and waits (`skipWaiting`/`clientsClaim` off in
  `quasar.config.js`), then is applied (SKIP_WAITING + one reload) right after the app opens,
  on a route change (`src/boot/pwa_update.js`) or when the app goes to the background - never
  while a dialog is open, a field has the focus or something was typed since the last route
  change. Updates are looked for on opening, every 30 minutes and when the app comes back to the
  screen. Tests: `src/boot/pwa_update.spec.js`.
- Sessions: the token stays in `sessionStorage`, so the installed app and each browser tab log
  in separately.
- `make build-pwa` writes `dist/pwa`. The teste site (`saas.teste`) is served from `dist/pwa`;
  pro still serves `dist/spa` and stays a plain SPA until its nginx `root` points to `dist/pwa`.

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).


