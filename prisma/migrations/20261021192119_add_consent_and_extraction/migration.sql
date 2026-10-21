-- CreateTable
CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "purposeText" TEXT NOT NULL,
    "wordingVersion" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'GRANTED',
    "grantedAt" DATETIME NOT NULL,
    "withdrawnAt" DATETIME,
    "source" TEXT NOT NULL DEFAULT 'consent-screen',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ExtractedHostelRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hostelName" TEXT NOT NULL,
    "campus" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "rentKsh" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "distanceKm" REAL,
    "sourceFile" TEXT NOT NULL,
    "sourceLine" TEXT NOT NULL,
    "confidence" REAL,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "ConsentRecord_email_idx" ON "ConsentRecord"("email");

-- CreateIndex
CREATE INDEX "ConsentRecord_purpose_idx" ON "ConsentRecord"("purpose");

-- CreateIndex
CREATE INDEX "ConsentRecord_status_idx" ON "ConsentRecord"("status");

-- CreateIndex
CREATE INDEX "ExtractedHostelRecord_campus_idx" ON "ExtractedHostelRecord"("campus");

-- CreateIndex
CREATE UNIQUE INDEX "ExtractedHostelRecord_hostelName_campus_key" ON "ExtractedHostelRecord"("hostelName", "campus");
