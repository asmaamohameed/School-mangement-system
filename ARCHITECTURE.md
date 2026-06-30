# School Management CRM — Architecture Overview

This document describes the technical architecture of the School Management CRM: a decoupled system comprising a **Backend API** (PHP ^8.2, Laravel ^12.0) and a **Frontend single-page application (SPA)** (Next.js ^16, React ^19, TypeScript ^5.9). The two applications communicate exclusively over HTTP/JSON. The Laravel API owns business logic, persistence, and authorization; the Next.js client owns routing, rendering, session presentation, and role-aware UI.

---

## 1. System Architecture

### Decoupled Backend API / Frontend SPA

The repository is split into two independently deployable applications:

| Layer | Stack | Responsibility |
|-------|-------|----------------|
| **Backend** (`Backend/`) | PHP ^8.2, Laravel ^12.0, Laravel Sanctum ^4.0 | REST API, domain models, validation, authorization, database |
| **Frontend** (`Frontend/`) | Next.js ^16 (App Router), React ^19, TypeScript, Tailwind CSS ^4, Axios | UI, client routing, auth token lifecycle, API consumption |

There is no server-side rendering of CRM data from Laravel into Blade views for the admin experience. Laravel exposes a stateless JSON API under `/api`; Next.js runs as a client-heavy SPA within the App Router, fetching data in `"use client"` page components after mount.

### Request Flow

```
Browser (Next.js SPA)
  → Axios client (Bearer token from localStorage)
  → Laravel API (auth:sanctum middleware)
  → Controller → Policy / query scope → Eloquent → API Resource → JSON
  → Next.js component state → TailAdmin UI
```

**Authentication:** `POST /api/login` returns a Sanctum personal access token and user payload. The frontend stores the token and user in `localStorage`, attaches `Authorization: Bearer {token}` on every request via an Axios interceptor, and redirects to `/signin` on `401`. Logout revokes the current token server-side.

**Authorization:** Enforced in three complementary layers on the backend—(1) route middleware (`role:admin,sales_rep` for school creation), (2) Eloquent query scoping in `index()` actions (e.g., sales reps see only their schools, visits, and tasks), and (3) Laravel Policies on single-resource actions (`view`, `update`, `delete`, `complete`). The frontend mirrors roles in sidebar navigation and conditional action buttons; the API remains the source of truth.

### Domain Model

The CRM centers on **School** as the pipeline hub. Related entities:

- **Contact** — people at a school (`school_id`)
- **Visit** — field visits with interest level, geo coordinates, and nested **VisitBook** line items
- **FollowUp** — customer-service call/meeting/note records with status workflow
- **Task** — assignable work items linked to schools and users
- **PipelineHistory** — audit trail of school stage transitions

**User roles** (`admin`, `sales_rep`, `customer_service`) drive both API behavior and dashboard metrics. The `DashboardController` returns role-specific aggregates (visits/leads for reps, pending follow-ups for CS, portfolio KPIs for admin).

### Frontend Structure

Next.js App Router route groups organize the UI without affecting URLs:

- `(admin)/` — authenticated shell (`AppSidebar`, `AppHeader`, auth guard) wrapping domain pages: dashboard, schools, contacts, visits, follow-ups, tasks
- `(full-width-pages)/(auth)/` — sign-in/sign-up flows

State is managed through React Context (`AuthContext`, `SidebarContext`, `ThemeContext`) and local `useState`/`useEffect` per page. There is no global data store (Redux/React Query); each list page fetches paginated Laravel collections directly via Axios.

---

## 2. Design Patterns & Coding Standards

### Backend Patterns

**PHP Enums (backed strings)** — Domain constants are type-safe and database-aligned:

| Enum | Purpose |
|------|---------|
| `UserRole` | `admin`, `sales_rep`, `customer_service` |
| `SchoolStage` | Pipeline: `lead` → `qualified` → `interested` → `follow_up` → `won` / `lost` |
| `VisitInterestLevel` | `Cold`, `Warm`, `Interested`, `HighlyInterested` |
| `FollowUpType` | Interaction type and workflow status `call`, `meeting`, `note`|
| `TaskStatus` | `pending`, `in_progress`, `completed` |

Enums are cast on Eloquent models (e.g., `School::$casts['stage'] = SchoolStage::class`) and referenced in Form Request rules via `Rule::enum()`.

**Form Requests** — All inbound mutation payloads pass through dedicated request classes (`StoreSchoolRequest`, `UpdateSchoolRequest`, `StoreVisitRequest`, etc.) with explicit validation rules. Controllers remain thin; invalid input returns `422` with field errors before business logic executes. Authorization for mutations is delegated to Policies and middleware rather than Form Request `authorize()` methods.

**API Resources** — Eloquent models are never returned raw. `JsonResource` transformers (`SchoolResource`, `VisitResource`, `FollowUpResource`, `TaskResource`, etc.) define the stable JSON contract consumed by the frontend. Nested relations use `whenLoaded()` and child resources to avoid N+1 exposure and to decouple internal schema from API shape.

**Model Policies** — `SchoolPolicy`, `ContactPolicy`, and `TaskPolicy` enforce ownership rules (e.g., sales reps may only view/update schools they created). Policies are registered in `AppServiceProvider` and invoked via `$this->authorize()` in controllers. Admin users bypass ownership checks.

**Additional conventions:**
- RESTful `apiResource` routes with selective `only`/`except` and custom actions (`PATCH /schools/{school}/stage`, `PATCH /tasks/{task}/complete`)
- DB transactions for multi-table writes (e.g., visit + books)
- Paginated index responses (`data` + `meta.current_page` / `meta.last_page`) aligned with frontend list pages
- Reference schema documented in `Backend/schema.dbml`

### Frontend Patterns

- **TypeScript interfaces** in `src/types/` (`school.ts`, `task.ts`, `followUp.ts`) mirror backend resources and enum values
- **Centralized HTTP client** (`src/lib/axios.ts`) with request/response interceptors for auth and global `403` toast dispatch
- **Component modularity** — reusable UI primitives under `src/components/ui/`, domain pages under `src/app/(admin)/`, layout chrome in `src/layout/`
- **Role-based rendering** — `AppSidebar` filters nav items by `UserRole`; pages gate Create/Edit/Delete actions client-side

---

## 3. Architectural Justifications

- **Modern framework baseline** — Laravel 12 on PHP 8.2 provides typed properties, enums, and a streamlined application skeleton (`bootstrap/app.php` middleware registration, health endpoint)
- **Native API ergonomics** — Sanctum token auth, Form Requests, API Resources, Policies, and Eloquent relationships map directly to a JSON-first CRM without ceremony
- **Robust ecosystem** — Queue infrastructure, migrations, factories/seeders, and PHPUnit/Pint/Sail are available out of the box; `jobs` and `cache` tables are already migrated
- **Security by convention** — Layered authorization (middleware + policies + query scoping) suits multi-role CRM access patterns

### Why Next.js + TypeScript

- **Type safety** — Shared domain types and discriminated dashboard unions (`dashboard_type`) catch integration errors at compile time
- **Component modularity** — App Router route groups, client/server component split (metadata on server pages, data fetching in client components), and TailAdmin-based UI primitives enable rapid feature pages without coupling to Laravel views
- **Independent deployment & routing** — The SPA handles navigation, theme, and layout state without round-trips to PHP; only data mutations and reads hit the API
- **Predictable state management** — React Context for session/theme/sidebar plus colocated page state keeps the data layer simple and traceable for a CRM of this scope

---

## 4. Future Scalability & System Evolution

The current schema (eight domain tables, school-centric FK graph) supports thousands of records comfortably on MySQL with the existing pagination and eager-loading patterns. As the school database and concurrent users grow, the following strategies align with the existing codebase and infrastructure.

### Database Engine: MySQL → PostgreSQL

PostgreSQL offers advanced indexing (partial, GIN/GiST), richer data types (JSONB for extensible school metadata, native `ENUM` or check constraints), and stronger analytical query performance. Migration path: Laravel migrations are largely driver-agnostic; switch `DB_CONNECTION=pgsql`, run schema against PostgreSQL, and add driver-specific indexes where beneficial (e.g., full-text search on `schools.name` or `tasks.title` using `tsvector`).

### Background Processing: Laravel Queues + Redis

Queue tables (`jobs`, `failed_jobs`) and `config/queue.php` are in place but no application Jobs exist yet. High-value async workloads for this CRM:

- **Daily follow-up alerts** — scan `follow_ups` where `status = pending` and `follow_up_date <= today`, notify assigned CS users
- **Email digests** — weekly pipeline summaries for admins (`SchoolStage` distribution, conversion metrics)
- **Bulk imports** — school/contact CSV ingestion without blocking HTTP requests

Implement `ShouldQueue` jobs, set `QUEUE_CONNECTION=redis`, and run `queue:work` workers. Redis as the queue driver also enables cache and session offload.

### Database Indexing on Foreign Keys

Migrations define FK constraints via `foreignId()` (implicit single-column indexes) but no composite indexes on high-traffic filter columns. Recommended additions as volume grows:

| Table | Index | Rationale |
|-------|-------|-----------|
| `visits` | `(rep_id, visit_date)` | Sales rep visit history and dashboard counts |
| `visits` | `(school_id)` | School detail timelines |
| `follow_ups` | `(status, follow_up_date)` | Pending follow-up dashboard and alert queries |
| `schools` | `(assigned_to, stage)` | Rep lead lists and admin pipeline filters |
| `schools` | `(stage)` | Admin conversion and stage aggregation |
| `tasks` | `(assigned_to, status)` | Task inbox and completion workflows |
| `contacts` | `(school_id)` | Contact lookups per school |

These indexes directly optimize existing controller queries (`DashboardController`, scoped `index()` methods, task search).

### Caching Dashboard Statistics

`DashboardController` currently executes live `COUNT()` queries on every `GET /dashboard`. At scale, cache per-role/per-user aggregates:

```php
Cache::remember("dashboard:{$user->role->value}:{$user->id}", now()->addMinutes(5), fn () => ...);
```

Invalidate on relevant writes (school stage change, follow-up status update, new visit) via model observers or queued cache-bust jobs. Redis as the cache driver (`CACHE_STORE=redis`) supports tagged invalidation and shared state across API instances.

### Frontend Scaling Notes

- Introduce **React Query or SWR** for list-page caching, stale-while-revalidate, and deduplicated fetches
- Add **Next.js middleware** for server-side auth redirects and optional role-based route guards
- Consolidate duplicated inline interfaces into `src/types/` as the API surface stabilizes
- Consider **API versioning** (`/api/v1/`) before breaking Resource shape changes

---

## Summary

The School Management CRM follows a **decoupled, API-first architecture**: Laravel 12 provides a typed, policy-enforced business core with Enums, Form Requests, API Resources, and Sanctum authentication; Next.js with TypeScript delivers a modular, role-aware SPA that consumes the JSON API through a centralized Axios client. The domain model is school-centric with clear extension points—queue workers, strategic indexes, response caching, and optional PostgreSQL migration— to support growth in schools, visits, and follow-up volume without restructuring the application.
