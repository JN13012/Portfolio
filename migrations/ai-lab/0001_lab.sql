-- Lab IA only, separate from the visit counter. No prompt, answer or clear IP is ever stored.
CREATE TABLE lab_sessions (
  session_hash TEXT PRIMARY KEY,
  secret TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  validations INTEGER NOT NULL DEFAULT 0,
  busy_until INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER NOT NULL
);
CREATE INDEX lab_sessions_expiry ON lab_sessions (expires_at);

CREATE TABLE lab_progress (
  session_hash TEXT NOT NULL,
  level INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  PRIMARY KEY (session_hash, level)
);
CREATE INDEX lab_progress_expiry ON lab_progress (expires_at);

CREATE TABLE lab_requests (
  session_hash TEXT NOT NULL,
  request_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  PRIMARY KEY (session_hash, request_id)
);
CREATE INDEX lab_requests_expiry ON lab_requests (expires_at);

-- HMAC of the IP with a key that changes daily; rows live 48 h at most.
CREATE TABLE lab_ip_usage (
  ip_hash TEXT NOT NULL,
  hour INTEGER NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (ip_hash, hour)
);
CREATE INDEX lab_ip_usage_hour ON lab_ip_usage (hour);

CREATE TABLE lab_budget (
  day TEXT PRIMARY KEY,
  neurons REAL NOT NULL
);
