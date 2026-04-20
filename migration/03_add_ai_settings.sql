-- Migration: Add AI Settings columns to ayarlar table
-- Date: 2026-02-11

ALTER TABLE ayarlar
ADD COLUMN ai_provider ENUM('openai', 'gemini') DEFAULT 'openai' AFTER cookie_fr_link,
ADD COLUMN openai_api_key VARCHAR(255) DEFAULT NULL AFTER ai_provider,
ADD COLUMN gemini_api_key VARCHAR(255) DEFAULT NULL AFTER openai_api_key,
ADD COLUMN ai_model VARCHAR(50) DEFAULT 'gpt-4o' AFTER gemini_api_key;
