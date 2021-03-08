/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[original_url]` on the table `urls`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "urls.original_url_unique" ON "urls"("original_url");
