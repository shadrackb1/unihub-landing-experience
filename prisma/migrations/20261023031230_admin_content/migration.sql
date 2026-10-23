-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "profilePhotoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "deposit" INTEGER,
    "location" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "description" TEXT NOT NULL,
    "features" TEXT NOT NULL DEFAULT '[]',
    "agentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "media" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'global',
    "siteName" TEXT NOT NULL DEFAULT 'UniHub',
    "siteUrl" TEXT NOT NULL DEFAULT '',
    "adminEmail" TEXT NOT NULL DEFAULT '',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT NOT NULL DEFAULT 'We are currently performing scheduled maintenance.',
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroImage" TEXT,
    "ctaText" TEXT NOT NULL,
    "featuredProperties" TEXT NOT NULL DEFAULT '[]',
    "theme" TEXT NOT NULL DEFAULT '{}',
    "features" TEXT NOT NULL DEFAULT '{}',
    "teamMembers" TEXT NOT NULL DEFAULT '[]',
    "updatedBy" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_SiteSettings" ("createdAt", "ctaText", "featuredProperties", "features", "heroImage", "heroSubtitle", "heroTitle", "id", "teamMembers", "theme", "updatedAt", "updatedBy") SELECT "createdAt", "ctaText", "featuredProperties", "features", "heroImage", "heroSubtitle", "heroTitle", "id", "teamMembers", "theme", "updatedAt", "updatedBy" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
