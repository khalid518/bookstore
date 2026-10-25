-- Application tables
CREATE TABLE IF NOT EXISTS books (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  author     TEXT NOT NULL,
  tag        TEXT NOT NULL,
  category   TEXT NOT NULL CHECK (category IN ('Fiction', 'Nonfiction')),
  price      NUMERIC(8, 2) NOT NULL CHECK (price >= 0),
  isbn       TEXT NOT NULL UNIQUE,
  staff_quote TEXT,
  staff_by    TEXT,
  position   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS events (
  id        TEXT PRIMARY KEY,
  title     TEXT NOT NULL,
  starts_at TIMESTAMP NOT NULL,
  blurb     TEXT NOT NULL
);

-- Richer event details (added after the first release, so these are idempotent ALTERs).
ALTER TABLE events ADD COLUMN IF NOT EXISTS description      TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS host             TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS duration_minutes INTEGER NOT NULL DEFAULT 90;
ALTER TABLE events ADD COLUMN IF NOT EXISTS admission        TEXT NOT NULL DEFAULT 'Free';
ALTER TABLE events ADD COLUMN IF NOT EXISTS highlights       TEXT[] NOT NULL DEFAULT '{}';

-- Better Auth tables (users, sessions, credentials)
CREATE TABLE IF NOT EXISTS "user" (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  image           TEXT,
  "createdAt"     TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session (
  id          TEXT PRIMARY KEY,
  "expiresAt" TIMESTAMP NOT NULL,
  token       TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId"    TEXT NOT NULL REFERENCES "user" (id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS session_user_idx ON session ("userId");

CREATE TABLE IF NOT EXISTS account (
  id                      TEXT PRIMARY KEY,
  "accountId"             TEXT NOT NULL,
  "providerId"            TEXT NOT NULL,
  "userId"                TEXT NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  "accessToken"           TEXT,
  "refreshToken"          TEXT,
  "idToken"               TEXT,
  "accessTokenExpiresAt"  TIMESTAMP,
  "refreshTokenExpiresAt" TIMESTAMP,
  scope                   TEXT,
  password                TEXT,
  "createdAt"             TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"             TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS account_user_idx ON account ("userId");

CREATE TABLE IF NOT EXISTS verification (
  id          TEXT PRIMARY KEY,
  identifier  TEXT NOT NULL,
  value       TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Pickup orders (paid in store). Prices are copied onto the line so later price edits don't change history.
CREATE TABLE IF NOT EXISTS orders (
  id         SERIAL PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
  total      NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  status     TEXT NOT NULL DEFAULT 'placed',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  order_id   INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  book_id    TEXT NOT NULL REFERENCES books (id),
  quantity   INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 9),
  unit_price NUMERIC(8, 2) NOT NULL,
  PRIMARY KEY (order_id, book_id)
);

CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id);

-- Newsletter signups from the landing page.
CREATE TABLE IF NOT EXISTS subscribers (
  email      TEXT PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
