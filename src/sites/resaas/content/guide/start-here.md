# Start here

RESAAS is two libraries that build multi-tenant business systems together:

| Library | What it is | Install from |
|---|---|---|
| **django_resaas** | Django REST backend: tenants (Entity → Branch), users, groups and permissions, a CRUD engine, a JSON schema of every model, dashboards, notifications, PDF | PyPI: `pip install django_resaas` |
| **quasar_resaas** | Vue 3 + Quasar frontend: reads that schema and renders forms, tables, filters, permissions-aware menus and dashboards | GitHub: `github:metanochava/quasar_resaas` |

The backend **describes** (models, permissions, schema); the frontend **renders** it. You write a
model, a serializer and a view — and get a full, tenant-scoped, permission-checked CRUD API plus a
screen for it.

This page takes you from nothing to a working screen in about 30 minutes. Each step links to the
full reference page when you need more.

## Prerequisites

- Python 3.9+ and Node.js 20+ (22 LTS recommended)
- A database: SQLite works for trying it; PostgreSQL for real use
- Git

## Part 1 — Backend (django_resaas)

### 1.1 Create the project

```bash
python -m venv venv && source venv/bin/activate
pip install django_resaas
django-admin startproject myproject
cd myproject
```

### 1.2 Configure `settings.py` and `urls.py`

Copy the settings from [Installation](/docs/django-resaas/getting-started/installation) —
`AUTH_USER_MODEL`, the three `django_resaas.*` apps, the middleware, `REST_FRAMEWORK` (with the
RESAAS exception handler) and the CORS headers. Two things people miss:

- **CORS headers** — the frontend sends `L`, `X-RESAAS-Context`, `FEK` and `FEP` on every request:
  `CORS_ALLOW_HEADERS = list(default_headers) + ['FEK', 'FEP', 'L', 'x-resaas-context']`, and put
  your frontend's origin in `CORS_ALLOWED_ORIGINS`.
- **URL order** — call `build_saas_urls()` after the `include('django_resaas.urls')`.

### 1.3 Create the database and the first tenant

```bash
python manage.py migrate
python manage.py resaas_setup     # languages, frontend defaults, translations
python manage.py create_entity    # interactive: your user, the first Entity/Branch, the Admin group
python manage.py migrate          # yes, again: creates the CRUD permissions
python manage.py runserver 0.0.0.0:7002
```

Check it: `http://localhost:7002/api/django_resaas/languages/` returns the four languages.

## Part 2 — Frontend (quasar_resaas)

### 2.1 Create a Quasar app and add the library

```bash
npm init quasar@latest     # choose: App with Quasar CLI (Vite), Vue 3, Pinia, JavaScript
cd my-app
```

```json
// package.json
"dependencies": {
  "quasar_resaas": "github:metanochava/quasar_resaas"
}
```

```bash
npm install
```

### 2.2 Wire it: one boot file, the environment, the routes

```js
// src/boot/resaas.js
import { Components } from 'quasar_resaas'
import { setPinia } from 'quasar_resaas/core/context'

export default ({ app, store }) => {
  Components({ app })   // registers every s-* component (s-btn, s-auto-crud, ...)
  setPinia(store)       // stores and services need Pinia outside components
}
```

```js
// quasar.config.js
boot: ['pinia', 'resaas'],
build: {
  env: {
    API: 'http://localhost:7002',   // the backend
    API_PREFIX: 'api'
  }
}
```

```js
// src/router/routes.js
import { restRoutes, authRoutes, docsRoutes, MainLayout } from 'quasar_resaas'

export default [
  ...authRoutes,          // /auth/login, /auth/register, ...
  ...docsRoutes,
  {
    path: '/',
    component: MainLayout,
    children: [...restRoutes]
  }
]
```

Run `npx quasar dev`, open `http://localhost:9000/#/auth/login` and sign in with the user from
`create_entity`. Details: [frontend Installation](/docs/quasar-resaas/getting-started/installation).

## Part 3 — Your first resource, end to end

### 3.1 Backend: model, serializer, view

```bash
python manage.py startapp catalog      # then add 'catalog' to MY_APPS
```

```python
# catalog/models.py
from django.db import models
from django_resaas.saas.core.base.models import BaseModel

class Product(BaseModel):   # entity, branch, soft delete, created/updated by: inherited
    name = models.CharField(max_length=150)
    sku = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class RESAAS:
        label_field = "name"
        search_fields = ["name", "sku"]
        crud = True
```

```python
# catalog/serializers.py
from django_resaas.saas.core.base.serializers import BaseSerializer
from catalog.models import Product

class ProductSerializer(BaseSerializer):
    class Meta:
        model = Product
        fields = "__all__"
```

```python
# catalog/views.py
from django_resaas.saas.core.base.views import BaseAPIView, registerView
from catalog.models import Product
from catalog.serializers import ProductSerializer

@registerView(module="catalog")
class ProductAPIView(BaseAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
```

Make sure the view module is imported at startup (for example `import catalog.views` in
`CatalogConfig.ready()`), then:

```bash
python manage.py makemigrations catalog
python manage.py migrate
```

You now have `GET/POST /api/catalog/products/`, `GET/PATCH/DELETE /api/catalog/products/<id>/`,
restore, search (`?search=`), filters, pagination and the schema — all scoped to the caller's
tenant and checked against `list_product`, `add_product`, `change_product`, ...

### 3.2 Activate the module and grant the permissions

An installed app is not active for every tenant. Activate it for your Entity and give your group
its permissions (Django shell, or the admin screens of the frontend):

```python
from django_resaas.saas.models.app import App
from django_resaas.saas.models.entity_app import EntityApp

app, _ = App.objects.get_or_create(name="catalog", defaults={"state": "Active"})
EntityApp.objects.get_or_create(entity=my_entity, app=app, defaults={"state": "Active"})
```

Without this, every call to the module answers `403`. See
[Quick start](/docs/django-resaas/getting-started/quick-start) and
[Permissions](/docs/django-resaas/security/permissions).

### 3.3 Frontend: one line of template

```vue
<!-- src/pages/catalog/ProductsPage.vue -->
<template>
  <s-auto-crud app="catalog" model="Product" />
</template>
```

Add a route for it (with `meta.requiredRole: 'list_product'`) and you get the table, search,
filters, the create/edit dialog, delete/restore and PDF — generated from the backend schema.
See [AutoCrud](/docs/quasar-resaas/components/auto-crud) and
[Creating a resource](/docs/quasar-resaas/development/creating-resource).

## How a request flows

```
Browser (quasar_resaas)
  headers: Authorization (JWT) + X-RESAAS-Context (signed tenant) + L (language)
      │
      ▼
django_resaas: TenantContextMiddleware → BaseAPIView
      module active?  →  permission for this action?  →  queryset scoped to Entity/Branch
      │
      ▼
{ data }  or  { "error": { "code", "message", "details" } }
```

## Where to go next

| I want to… | Read |
|---|---|
| Understand tenants, branches and the context token | [Multi-tenancy](/docs/django-resaas/architecture/multi-tenancy) |
| Control who can do what | [Permissions](/docs/django-resaas/security/permissions), [Field-level permissions](/docs/django-resaas/security/field-permissions) |
| Configure a model's behaviour (search, labels, CRUD) | [Models & RESAAS](/docs/django-resaas/models/resaas-config) |
| Know the exact schema the frontend reads | [Schema 1.0 contract](/docs/django-resaas/api/schema-contract) |
| Build a custom form instead of the automatic one | [Form](/docs/quasar-resaas/components/form), [BaseStore](/docs/quasar-resaas/stores/base-store) |
| Show messages and errors correctly | [Errors and alerts](/docs/quasar-resaas/features/errors-and-alerts) |
| Add dashboards | [Dynamic dashboards](/docs/django-resaas/architecture/dashboards) |
| Send emails / SMS / WhatsApp | [Notifications](/docs/django-resaas/features/notifications) |
| Translate the interface (4 languages) | [Translation](/docs/quasar-resaas/features/translation) |
| Fix a problem | [Backend troubleshooting](/docs/django-resaas/troubleshooting/common-errors), [Frontend troubleshooting](/docs/quasar-resaas/troubleshooting/common-errors) |

## Source code

- Backend: [github.com/metanochava/django_resaas](https://github.com/metanochava/django_resaas) — the runnable example project is in `src/dev/`
- Frontend: [github.com/metanochava/quasar_resaas](https://github.com/metanochava/quasar_resaas)
