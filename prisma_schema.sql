-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleInternal" TEXT NOT NULL,
    "seoScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "componentType" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "schemaDef" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "contentData" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClickEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromPage" TEXT NOT NULL,
    "toUrl" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'outbound',
    "referer" TEXT,
    "refDomain" TEXT,
    "ua" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "ip" TEXT,
    "country" TEXT,
    "city" TEXT,

    CONSTRAINT "ClickEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page" TEXT NOT NULL,
    "referer" TEXT,
    "refDomain" TEXT,
    "country" TEXT,
    "city" TEXT,
    "device" TEXT,
    "ip" TEXT,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_blockId_locale_key" ON "Translation"("blockId", "locale");

-- CreateIndex
CREATE INDEX "ClickEvent_createdAt_idx" ON "ClickEvent"("createdAt");

-- CreateIndex
CREATE INDEX "ClickEvent_fromPage_idx" ON "ClickEvent"("fromPage");

-- CreateIndex
CREATE INDEX "ClickEvent_category_idx" ON "ClickEvent"("category");

-- CreateIndex
CREATE INDEX "ClickEvent_country_idx" ON "ClickEvent"("country");

-- CreateIndex
CREATE INDEX "ClickEvent_device_idx" ON "ClickEvent"("device");

-- CreateIndex
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");

-- CreateIndex
CREATE INDEX "PageView_page_idx" ON "PageView"("page");

-- CreateIndex
CREATE INDEX "PageView_country_idx" ON "PageView"("country");

-- AddForeignKey
ALTER TABLE "ContentBlock" ADD CONSTRAINT "ContentBlock_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "ContentBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

