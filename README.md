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
`src/entity-type-sites/index.spec.js` checks the registration of the EntityType sites.

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

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).


