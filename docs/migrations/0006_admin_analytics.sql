-- SKINKSA admin dashboard + analytics (revision 0006_admin_analytics)
-- Run against the same database as DATABASE_URL (PostgreSQL).

ALTER TABLE orders ADD COLUMN IF NOT EXISTS geo_is_tor BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS geo_secondary_vpn BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE orders ALTER COLUMN geo_is_tor DROP DEFAULT;
ALTER TABLE orders ALTER COLUMN geo_secondary_vpn DROP DEFAULT;

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    event_type VARCHAR(50) NOT NULL,
    path VARCHAR(500),
    product_slug VARCHAR(200),
    session_id VARCHAR(80),
    ip_address VARCHAR(50),
    user_agent TEXT,
    utm_source VARCHAR(200),
    utm_medium VARCHAR(200),
    utm_campaign VARCHAR(200),
    geo_country VARCHAR(10),
    geo_is_vpn BOOLEAN NOT NULL DEFAULT false,
    geo_is_proxy BOOLEAN NOT NULL DEFAULT false,
    geo_is_tor BOOLEAN NOT NULL DEFAULT false,
    geo_is_hosting BOOLEAN NOT NULL DEFAULT false,
    secondary_vpn_detected BOOLEAN NOT NULL DEFAULT false,
    is_valid_traffic BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS ix_analytics_events_created_valid
    ON analytics_events (created_at, is_valid_traffic);

CREATE INDEX IF NOT EXISTS ix_analytics_events_session_created
    ON analytics_events (session_id, created_at);
