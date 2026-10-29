CREATE TABLE visit_total (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  total INTEGER NOT NULL DEFAULT 0 CHECK (total >= 0)
);
INSERT INTO visit_total (id, total) VALUES (1, 0);

-- Only random session hashes and their expiry are kept, never IPs or user agents.
CREATE TABLE visit_sessions (
  session_hash TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL
);
CREATE INDEX visit_sessions_expiry ON visit_sessions (expires_at);

-- The trigger runs only for an actual insertion, including concurrent retries.
CREATE TRIGGER count_new_visit AFTER INSERT ON visit_sessions
BEGIN
  UPDATE visit_total SET total = total + 1 WHERE id = 1;
END;
