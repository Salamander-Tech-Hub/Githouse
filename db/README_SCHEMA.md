PostgreSQL schema for Githouse

This document maps the SQL schema in `db/schema.sql` to the frontend types and lists common queries and migration/tooling suggestions.

Key tables and purpose

- users
  - Maps to `User` in `types.ts`. Fields: id (uuid), name, handle, avatar_url, role, status, bio, location, created_at, last_activity_at

- communities
  - Maps to `Community` in `types.ts`. Fields: id, name, slug, description, image_url, visibility, owner_id, member_count

- community_memberships
  - Tracks membership and role in communities (member, moderator, admin, owner).

- follows
  - User-to-user follow graph. Use to implement 'Follow' buttons in the UI.

- activities
  - Generic activity feed and analytics events used by `ActivityChart` and other dashboard charts. Stores type, user, target, metadata, timestamp.

- reports, moderation_logs
  - Support reports and moderator actions used by `ModerationPanel`.

- notifications
  - Per-user notifications with payload JSON and read tracking.

Common queries

1) Fetch recommended users (simple example):

SELECT id, name, handle, avatar_url, role
FROM users
WHERE role IN ('project_author','maintainer')
ORDER BY created_at DESC
LIMIT 10;

2) Get communities with member counts and a few avatars (for CommunityFinder cards):

SELECT c.id, c.name, c.slug, c.description, c.image_url, c.member_count,
  (SELECT jsonb_agg(jsonb_build_object('avatar_url', u.avatar_url, 'name', u.name))
   FROM community_memberships m JOIN users u ON u.id = m.user_id
   WHERE m.community_id = c.id
   ORDER BY m.joined_at DESC LIMIT 3) AS recent_members
FROM communities c
ORDER BY c.member_count DESC
LIMIT 12;

3) Moderation panel list (users with status and last activity):

SELECT id, name, handle, avatar_url, role, status, last_activity_at
FROM users
ORDER BY last_activity_at DESC
LIMIT 50;

4) Activity chart (actions per day):

SELECT date_trunc('day', created_at) AS day, COUNT(*) AS actions
FROM activities
WHERE created_at >= now() - interval '7 days'
GROUP BY day
ORDER BY day;

Migration and tooling recommendations

- Use a migration tool: Flyway, Liquibase, or for Node.js projects use Knex migrations or Prisma Migrate.
- Consider Prisma if you want an ORM and type-safe database mapping; it will generate a client from your schema and map nicely to TypeScript types.
- For high write volumes on `activities`, consider partitioning by time or using a time-series store for analytics.
- Add constraints and validations at the application layer as well as the DB (e.g., validate handle format, enforce upload limits for avatars).

Next steps

- If you want, I can:
  - Generate a Prisma schema (schema.prisma) from this SQL and wire up a minimal Node.js seed script.
  - Create Knex migration files instead of a single .sql file.
  - Add DB indices tuned to your expected query patterns (I added some defaults but can tailor them).

Requirements coverage

- Full CREATE TYPE and CREATE TABLE DDL provided: Done
- Enums, constraints, FK relationships: Done
- Trigger to update community member count: Done (simple trigger)
- Sample seed data: Done (idempotent inserts)

How to run

1. Create a PostgreSQL database and user.
2. Run the SQL in `db/schema.sql` as a superuser (pgcrypto extension required):

psql -d yourdb -f db/schema.sql

(Or use your migration tooling if preferred.)

If you want Prisma or migration files, tell me which tool you'd prefer and I will generate them.