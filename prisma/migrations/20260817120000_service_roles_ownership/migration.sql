-- Replace the generic user role with explicit platform roles without relying
-- on transactional ALTER TYPE ... ADD VALUE behavior.
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE TEXT USING "role"::text;
UPDATE "users" SET "role" = 'CONSUMER' WHERE "role" = 'USER';
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'PRODUCER', 'CONSUMER');
ALTER TABLE "users"
  ALTER COLUMN "role" TYPE "Role_new"
  USING ("role"::text::"Role_new");
DROP TYPE "Role";
ALTER TYPE "Role_new" RENAME TO "Role";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CONSUMER';

ALTER TABLE "Service" ADD COLUMN "providerId" TEXT;
UPDATE "Service"
SET "providerId" = (SELECT "id" FROM "users" ORDER BY "created_at" LIMIT 1)
WHERE "providerId" IS NULL;

ALTER TABLE "Service" ALTER COLUMN "providerId" SET NOT NULL;
ALTER TABLE "Service" ADD CONSTRAINT "Service_providerId_fkey"
  FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Service" ALTER COLUMN "image" TYPE TEXT USING "image"::text;
