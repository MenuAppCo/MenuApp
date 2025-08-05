/*
  Warnings:

  - You are about to drop the column `email` on the `restaurants` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `restaurants` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "restaurants_email_key";

-- AlterTable
ALTER TABLE "restaurants" DROP COLUMN "email",
DROP COLUMN "password";
