-- Initial database setup for PromptGOD
-- This script runs automatically when the PostgreSQL container starts

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'skeptic', 'kiddo', 'engineer', 'god');
CREATE TYPE prompt_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE transaction_type AS ENUM ('purchase', 'usage', 'bonus', 'refund');

-- Add comments for documentation
COMMENT ON TYPE subscription_tier IS 'User subscription tiers';
COMMENT ON TYPE prompt_status IS 'Status of a prompt';
COMMENT ON TYPE transaction_type IS 'Type of token transaction';

-- Create initial database schema version tracking
CREATE TABLE IF NOT EXISTS schema_versions (
    version INTEGER PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

INSERT INTO schema_versions (version, description) 
VALUES (1, 'Initial PromptGOD database schema')
ON CONFLICT (version) DO NOTHING;