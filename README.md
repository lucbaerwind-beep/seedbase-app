# SEEDBASE

SEEDBASE is a B2B web platform for vegetable seed companies to list varieties and receive direct inquiries from buyers.

## Features
- Email/password authentication
- Company profiles with up to five seed listings
- Public directory and seed detail pages
- Inquiry forms with dashboard visibility

## Tech stack
- Next.js (App Router)
- Prisma + PostgreSQL

## Getting started
1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Database schema
See `prisma/schema.prisma` for the full data model.
