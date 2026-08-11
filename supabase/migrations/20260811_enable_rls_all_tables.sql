-- =============================================================================
-- RLS (Row-Level Security) Migration
-- Enable RLS on all public tables and add appropriate policies.
--
-- Strategy:
--   • Prisma uses postgres superuser → bypasses RLS entirely (no breakage)
--   • Supabase anon key access is controlled per table below
--   • "Public content" tables: anon can SELECT (website content delivery)
--   • "Tracking" tables: anon can INSERT only (analytics)
--   • "Admin/financial" tables: no anon access whatsoever
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. PUBLIC CONTENT — anon SELECT allowed (website content, no sensitive data)
-- ---------------------------------------------------------------------------

ALTER TABLE "Page"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContentBlock" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Translation"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SeoMeta"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Service"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Faq"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Media"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Redirect"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Testimonial"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BeforeAfter"  ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Video') THEN
    EXECUTE 'ALTER TABLE "Video" ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- Public read: all pages
CREATE POLICY "public_read_pages"
  ON "Page" FOR SELECT TO anon USING (true);

-- Public read: all content blocks
CREATE POLICY "public_read_blocks"
  ON "ContentBlock" FOR SELECT TO anon USING (true);

-- Public read: all translations
CREATE POLICY "public_read_translations"
  ON "Translation" FOR SELECT TO anon USING (true);

-- Public read: all SEO meta
CREATE POLICY "public_read_seo_meta"
  ON "SeoMeta" FOR SELECT TO anon USING (true);

-- Public read: all services
CREATE POLICY "public_read_services"
  ON "Service" FOR SELECT TO anon USING (true);

-- Public read: all FAQs
CREATE POLICY "public_read_faqs"
  ON "Faq" FOR SELECT TO anon USING (true);

-- Public read: all media
CREATE POLICY "public_read_media"
  ON "Media" FOR SELECT TO anon USING (true);

-- Public read: all redirects
CREATE POLICY "public_read_redirects"
  ON "Redirect" FOR SELECT TO anon USING (true);

-- Public read: only approved testimonials
CREATE POLICY "public_read_testimonials"
  ON "Testimonial" FOR SELECT TO anon USING (approved = true);

-- Public read: only consented, public before/after photos
CREATE POLICY "public_read_before_after"
  ON "BeforeAfter" FOR SELECT TO anon USING ("isPublic" = true AND consent = true);

-- ---------------------------------------------------------------------------
-- 2. RESERVATION TABLES — anon SELECT allowed (booking widget)
-- ---------------------------------------------------------------------------

ALTER TABLE reservation_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_blackouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_reservation_settings"
  ON reservation_settings FOR SELECT TO anon USING (true);

CREATE POLICY "public_read_reservation_blackouts"
  ON reservation_blackouts FOR SELECT TO anon USING (true);

-- ---------------------------------------------------------------------------
-- 3. TRACKING TABLES — anon INSERT only (analytics collection)
-- ---------------------------------------------------------------------------

ALTER TABLE "ClickEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PageView"   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_click_events"
  ON "ClickEvent" FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "public_insert_page_views"
  ON "PageView" FOR INSERT TO anon WITH CHECK (true);

-- ---------------------------------------------------------------------------
-- 4. ADMIN TABLES — no anon access (admin-only via postgres/service_role)
-- ---------------------------------------------------------------------------

ALTER TABLE "Setting"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cari_users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE cari_entries        ENABLE ROW LEVEL SECURITY;
ALTER TABLE cari_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cari_service_types  ENABLE ROW LEVEL SECURITY;
ALTER TABLE cari_payment_types  ENABLE ROW LEVEL SECURITY;

-- No policies added = deny all anon access
-- Prisma (postgres role) still has full access — server-side app unaffected

-- ---------------------------------------------------------------------------
-- 5. VERIFY — confirm RLS is now enabled on all tables
-- ---------------------------------------------------------------------------
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
