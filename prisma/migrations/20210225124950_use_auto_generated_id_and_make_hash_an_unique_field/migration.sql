/*
  Warnings:

  - The migration will change the primary key for the `Url` table. If it partially fails, the table could be left without primary key constraint.
  - The migration will add a unique constraint covering the columns `[hash]` on the table `Url`. If there are existing duplicate values, the migration will fail.

*/
-- AlterTable
ALTER TABLE "Url" DROP CONSTRAINT "Url_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "hits" SET DEFAULT 1,
ADD PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Url.hash_unique" ON "Url"("hash");
