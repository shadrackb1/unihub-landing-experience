-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'global',
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
