# HTML2PDF Pro Architecture

## Active Scope

This document covers MVP Phase 1 and Phase 2 only. It establishes the product boundary, technical architecture and base project infrastructure. The following areas are intentionally out of scope for this phase:

- Authentication implementation
- PDF generation engine
- Chromium worker
- BullMQ job processing
- Payment and Stripe integration
- Admin panel
- API key management
- Functional user dashboard workflows

## Repository Assessment

The repository started with project instructions and product specification documents only. There was no existing application code, package manager configuration, framework setup, database schema or test harness. Because there was no running structure to preserve, the initial implementation creates a clean workspace foundation.

## MVP Boundary

The full MVP described in `docs/PRODUCT_SPEC.md` includes authentication, HTML and URL conversion, queue-backed PDF generation, conversion history, usage limits, Stripe test mode, API keys, SSRF protection, rate limiting, Docker Compose and test coverage.

For this task, the active MVP boundary is narrowed to Phase 1 and Phase 2:

- Product and technical architecture documentation
- Next.js App Router application shell
- Strict TypeScript baseline
- Tailwind CSS baseline
- ESLint and Prettier configuration
- Environment variable validation
- Vitest test harness
- Docker Compose services for PostgreSQL and Redis
- Prisma schema and database package structure
- README and `.env.example`

## Technical Decisions

- Use a pnpm workspace without Turborepo for the first foundation. This keeps the setup small while still allowing separate app and package boundaries.
- Place the web application in `apps/web`.
- Place shared environment validation in `packages/config`.
- Place Prisma schema and database client exports in `packages/database`.
- Use Next.js App Router with React strict mode and TypeScript strict compiler settings.
- Use Zod for environment validation.
- Use Prisma with PostgreSQL as the source of truth for product entities.
- Use Redis only as an infrastructure dependency in this phase; queue implementation is deferred.
- Use Vitest with jsdom for unit-level tests.

## Security Decisions

- Secrets are represented only as names and examples in `.env.example`; no real secret values are committed.
- Environment variables are centrally validated before use.
- The Prisma model includes hashed API keys and password hash fields but no authentication logic is implemented in this phase.
- URL-to-PDF SSRF defenses are documented as a mandatory future implementation before any URL conversion endpoint is created.
- PDF generation is not implemented in request handlers; the architecture reserves separate worker and queue boundaries for the next phase.

## Project Structure

```text
apps/
  web/
    src/app/
packages/
  config/
  database/
    prisma/
docs/
docker-compose.yml
```

Future packages can be added without reshaping the repository:

- `packages/pdf-engine`
- `packages/queue`
- `packages/storage`
- `packages/payments`
- `packages/auth`
- `packages/email`
- `apps/worker`

## Database Model Direction

The initial Prisma schema includes the core commercial SaaS entities needed by the product specification:

- Users, accounts, sessions and verification tokens
- Organizations and organization members
- Plans, plan features and subscriptions
- Usage records
- Conversions and conversion files
- Templates and template versions
- API keys
- Webhook endpoints and deliveries
- Payments and invoices
- Audit logs, admin actions and coupons

The schema is intentionally a starting point. It should be evolved with migrations as implementation phases add real workflows.

## Application Flow Direction

The target conversion flow for later phases is:

1. Web or API request validates identity, entitlement and input.
2. Conversion metadata is created in PostgreSQL.
3. A job is queued in Redis.
4. A separate worker performs PDF generation in an isolated browser process.
5. The generated PDF is stored through a storage abstraction.
6. Conversion status and usage are updated transactionally.
7. The user receives a short-lived download link.

No part of that conversion flow is implemented in this phase.

## Phase 2 Completion Criteria

Phase 2 is complete when:

- The workspace installs dependencies.
- The web app builds.
- Lint passes.
- TypeScript strict typecheck passes.
- Vitest tests pass.
- Prisma schema validates.
- Docker Compose defines PostgreSQL and Redis.

