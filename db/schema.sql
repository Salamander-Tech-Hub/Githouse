-- PostgreSQL schema for Githouse
-- Generated: 2025-10-18

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ENUMs
-- Roles used in the UI: Project Author, Maintainer, Community Manager, User, etc.
CREATE TYPE user_role AS ENUM ('user', 'project_author', 'maintainer', 'community_manager', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending');

CREATE TYPE community_visibility AS ENUM ('public', 'private', 'restricted');
CREATE TYPE membership_role AS ENUM ('member', 'moderator', 'admin', 'owner');

CREATE TYPE activity_type AS ENUM (
  'post', 'comment', 'follow', 'unfollow', 'join_community', 'leave_community', 'like', 'unlike', 'report', 'moderation_action', 'other'
);

CREATE TYPE report_status AS ENUM ('open', 'in_review', 'resolved', 'dismissed');
CREATE TYPE moderation_action AS ENUM ('none', 'warn', 'suspend', 'ban', 'note');

CREATE TYPE notification_type AS ENUM ('follow', 'mention', 'community_invite', 'report_update', 'moderator_message', 'system');

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  handle text NOT NULL UNIQUE,
  email text UNIQUE,
  avatar_url text,
  role user_role NOT NULL DEFAULT 'user',
  status user_status NOT NULL DEFAULT 'active',
  bio text,
  location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_activity_at timestamptz,
  settings jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_activity_at ON users(last_activity_at);

-- COMMUNITIES
CREATE TABLE IF NOT EXISTS communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  visibility community_visibility NOT NULL DEFAULT 'public',
  owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  member_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_communities_name ON communities (name);
CREATE INDEX IF NOT EXISTS idx_communities_owner ON communities (owner_id);

-- MEMBERSHIPS (users <-> communities)
CREATE TABLE IF NOT EXISTS community_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role membership_role NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  is_approved boolean NOT NULL DEFAULT true,
  is_banned boolean NOT NULL DEFAULT false,
  UNIQUE (community_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON community_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_community ON community_memberships(community_id);

-- FOLLOWERS (user-to-user follow graph)
CREATE TABLE IF NOT EXISTS follows (
  follower_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followee_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, followee_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_followee ON follows(followee_id);

-- ACTIVITIES (feed & analytics)
-- Flexible table to record user actions used for charts and activity feed.
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  type activity_type NOT NULL,
  target_type text,
  target_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activities_user_time ON activities(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type_time ON activities(type, created_at DESC);

-- REPORTS (user-submitted moderation reports)
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES users(id) ON DELETE SET NULL,
  reported_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  community_id uuid REFERENCES communities(id) ON DELETE SET NULL,
  description text,
  evidence jsonb DEFAULT '[]'::jsonb, -- array of attachment refs or urls
  status report_status NOT NULL DEFAULT 'open',
  assigned_moderator_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action_taken moderation_action NOT NULL DEFAULT 'none',
  action_metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user ON reports(reported_user_id);

-- MODERATOR ACTIONS / AUDIT LOG
CREATE TABLE IF NOT EXISTS moderation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE SET NULL,
  moderator_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action moderation_action NOT NULL,
  reason text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_moderation_logs_report ON moderation_logs(report_id);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  payload jsonb DEFAULT '{}'::jsonb,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  read_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id) WHERE (is_read = false);

-- SIMPLE STATS / AGGREGATES TABLE (optional denormalized counts)
CREATE TABLE IF NOT EXISTS stats_counters (
  id serial PRIMARY KEY,
  entity_type text NOT NULL, -- e.g. 'user', 'community'
  entity_id uuid NOT NULL,
  counter_name text NOT NULL,
  value bigint NOT NULL DEFAULT 0,
  UNIQUE (entity_type, entity_id, counter_name)
);

-- Helpful function: update community member_count when membership changes
CREATE OR REPLACE FUNCTION refresh_community_member_count() RETURNS trigger AS $$
BEGIN
  UPDATE communities
  SET member_count = (
    SELECT COUNT(*) FROM community_memberships WHERE community_id = NEW.community_id AND is_banned = false
  ), updated_at = now()
  WHERE id = NEW.community_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_membership_after_insert
AFTER INSERT OR UPDATE OR DELETE ON community_memberships
FOR EACH ROW EXECUTE FUNCTION refresh_community_member_count();

-- SAMPLE SEED DATA (minimal)
-- Roles and sample users
INSERT INTO users (id, name, handle, email, avatar_url, role, status, bio, location, created_at)
VALUES
  (gen_random_uuid(), 'Andrew Kim', 'Andi', 'andi@example.com', 'https://i.pravatar.cc/150?img=1', 'project_author', 'active', 'Technical Lead at Salamander', 'Remote', now()),
  (gen_random_uuid(), 'Charles Mbugua', 'Charles', 'charles@example.com', 'https://i.pravatar.cc/150?img=2', 'maintainer', 'active', 'Maintainer', 'Nairobi', now()),
  (gen_random_uuid(), 'Festus Pro', 'festuspro', 'festus@example.com', 'https://i.pravatar.cc/150?img=5', 'user', 'active', 'DevOps Engineer', 'Remote', now());

-- Sample communities
INSERT INTO communities (id, name, slug, description, image_url, visibility, owner_id, member_count)
VALUES
  (gen_random_uuid(), 'Andi - "NauraNat"', 'andi-nauranat', 'Technical Lead at Salamander', 'https://picsum.photos/seed/community1/400/200', 'public', (SELECT id FROM users WHERE handle = 'Andi' LIMIT 1), 1),
  (gen_random_uuid(), 'Trendi: New Quantum..', 'trendi-quantum', 'Exploring the future of computing', 'https://picsum.photos/seed/community2/400/200', 'public', (SELECT id FROM users WHERE handle = 'Charles' LIMIT 1), 1);

-- Sample membership
INSERT INTO community_memberships (community_id, user_id, role)
SELECT c.id, u.id, 'owner' FROM communities c JOIN users u ON u.handle = 'Andi' WHERE c.slug = 'andi-nauranat';

-- Sample activity rows
INSERT INTO activities (user_id, type, target_type, target_id, metadata)
SELECT id, 'join_community'::activity_type, 'community', (SELECT id FROM communities WHERE slug = 'andi-nauranat' LIMIT 1), jsonb_build_object('note','joined via seed')
FROM users WHERE handle = 'Andi' LIMIT 1;

-- A couple of example reports
INSERT INTO reports (reporter_id, reported_user_id, community_id, description, evidence, status)
SELECT (SELECT id FROM users WHERE handle = 'festuspro' LIMIT 1), (SELECT id FROM users WHERE handle = 'Andi' LIMIT 1), (SELECT id FROM communities WHERE slug = 'andi-nauranat' LIMIT 1), 'Spam behavior observed', '[]'::jsonb, 'open'
;

-- Idempotent helper: avoid duplicate seed users by checking handle
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE handle = 'stevo') THEN
    INSERT INTO users (id, name, handle, email, avatar_url, role, status, bio, location, created_at)
    VALUES (gen_random_uuid(), 'Steve Kingoro', 'stevo', 'steve@example.com', 'https://i.pravatar.cc/150?img=10', 'user', 'suspended', 'Previously suspended user', 'Nairobi', now());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM users WHERE handle = 'randy') THEN
    INSERT INTO users (id, name, handle, email, avatar_url, role, status, bio, location, created_at)
    VALUES (gen_random_uuid(), 'Randy Lutta', 'randy', 'randy@example.com', 'https://i.pravatar.cc/150?img=11', 'user', 'active', 'Active user', 'Kisumu', now());
  END IF;
END$$;

-- Ensure community member_count is accurate after seeding
UPDATE communities SET member_count = (
  SELECT COUNT(*) FROM community_memberships WHERE community_id = communities.id AND is_banned = false
) ;

-- Notes:
-- - This schema uses uuid primary keys via pgcrypto's gen_random_uuid().
-- - The trigger to refresh community member counts is simple; for large workloads consider using background jobs.
-- - The activities table is intentionally generic for analytics; normalize into separate tables if you need strict referential integrity for different activity types.

-- End of schema
