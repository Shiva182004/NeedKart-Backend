-- A deleted category name may be reused, but active category names must be
-- unique even when casing differs. This also protects concurrent requests.
CREATE UNIQUE INDEX "Category_active_name_unique"
ON "Category" (LOWER("name"))
WHERE "deleted_at" IS NULL;
