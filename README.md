# SEEDBASE

SEEDBASE is a production-ready B2B discovery platform for vegetable seed suppliers. Visitors can browse suppliers
and varieties, while verified suppliers manage listings and receive direct inquiries.

## Features
- Supplier and variety directories with search, filters, and pagination.
- Supplier profiles with inquiry forms and company details.
- Supplier dashboard for company profile updates, variety CRUD, and inquiry inbox.
- Admin moderation for supplier approvals and featured listings.
- Inquiry flow with rate limiting, honeypot spam protection, and email stub.
- SEO-ready metadata, sitemap, and robots configuration.

## Tech stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Custom email/password auth

## Getting started
1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run database migrations and seed:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Environment variables
```
DATABASE_URL=postgresql://user:password@localhost:5432/seedbase
SESSION_SECRET=replace-with-secure-secret
```

## File storage
Supplier logos and variety images are stored as URLs. For production, connect an S3-compatible bucket and upload
assets there, then save the public URL on the supplier or variety record.

## Database schema
See `prisma/schema.prisma` for the full data model.

## Seed data logins
After seeding, use the following credentials:
- Admin: `admin@seedbase.example.com` / `Password123!`
- Suppliers: `<supplier-slug>@seedbase.example.com` / `Password123!`
