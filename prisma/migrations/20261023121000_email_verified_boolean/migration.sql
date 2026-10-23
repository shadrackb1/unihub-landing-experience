-- better-auth writes `emailVerified` as a boolean, but the column was created
-- as DATETIME, so every sign-up failed with a validation error. SQLite cannot
-- retype a column, so the table is rebuilt and each non-null timestamp is
-- carried over as `true`.

PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'TENANT',
    "image" TEXT,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "banReason" TEXT,
    "banExpires" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_User" (
    "id",
    "email",
    "emailVerified",
    "name",
    "password",
    "role",
    "image",
    "banned",
    "banReason",
    "banExpires",
    "createdAt",
    "updatedAt"
)
SELECT
    "id",
    "email",
    CASE WHEN "emailVerified" IS NULL THEN false ELSE true END,
    "name",
    "password",
    "role",
    "image",
    "banned",
    "banReason",
    "banExpires",
    "createdAt",
    "updatedAt"
FROM "User";

DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
