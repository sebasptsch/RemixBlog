/*
  Warnings:

  - The primary key for the `PostTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tagId` on the `PostTag` table. All the data in the column will be lost.
  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tags` table. All the data in the column will be lost.
  - Added the required column `tagLabel` to the `PostTag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PostTag" DROP CONSTRAINT "PostTag_tagId_fkey";

-- DropIndex
DROP INDEX "tags_label_key";

-- AlterTable
ALTER TABLE "PostTag" DROP CONSTRAINT "PostTag_pkey",
DROP COLUMN "tagId",
ADD COLUMN     "tagLabel" TEXT NOT NULL,
ADD CONSTRAINT "PostTag_pkey" PRIMARY KEY ("postId", "tagLabel");

-- AlterTable
ALTER TABLE "tags" DROP CONSTRAINT "tags_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("label");

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_tagLabel_fkey" FOREIGN KEY ("tagLabel") REFERENCES "tags"("label") ON DELETE RESTRICT ON UPDATE CASCADE;
