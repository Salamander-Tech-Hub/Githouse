# Githouse backend (SQLite + Prisma + Express)

This lightweight backend uses TypeScript, Express, and Prisma with SQLite for local development.

Quick start

1. Change into the server directory:

   cd server

2. Install dependencies:

   npm install

3. Generate Prisma client:

   npx prisma generate

4. Create the SQLite DB and run the first migration (Prisma will create the dev.db):

   npx prisma migrate dev --name init

5. Seed the database (this uses ts-node):

   npm run seed

6. Run in development mode:

   npm run dev

Endpoints

- GET /health — simple health check
- GET /users — list users (limit 50)
- POST /communities — create a community (name, slug, description, ownerId)

Notes

- This is a minimal scaffold. For production use, replace SQLite with Postgres and add proper auth, validation, and error handling.
- If you see TypeScript errors about @prisma/client while developing, ensure `npx prisma generate` completed successfully.
