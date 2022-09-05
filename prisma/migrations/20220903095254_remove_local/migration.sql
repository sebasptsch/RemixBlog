/*
  Warnings:

  - The values [LOCAL] on the enum `AccountType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `bannerSrc` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `providers` table. All the data in the column will be lost.
  - You are about to drop the column `avatarSrc` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[uid,provider]` on the table `providers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccountType_new" AS ENUM ('DISCORD', 'GITHUB');
ALTER TABLE "providers" ALTER COLUMN "provider" TYPE "AccountType_new" USING ("provider"::text::"AccountType_new");
ALTER TYPE "AccountType" RENAME TO "AccountType_old";
ALTER TYPE "AccountType_new" RENAME TO "AccountType";
DROP TYPE "AccountType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_userId_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "bannerSrc";

-- AlterTable
ALTER TABLE "providers" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatarSrc";

-- DropTable
DROP TABLE "images";

-- CreateIndex
CREATE UNIQUE INDEX "providers_uid_provider_key" ON "providers"("uid", "provider");
