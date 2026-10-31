-- One-time historical baseline requested by the portfolio owner on 2026-10-31.
-- Source: owner-provided Cloudflare Web Analytics summary, 7 visits (10 page views).
-- Analytics visits and D1 tab sessions use different counting methods.
-- Preserve sessions already counted; Wrangler's migration ledger prevents reapplying this import.
UPDATE visit_total SET total = total + 7 WHERE id = 1;
