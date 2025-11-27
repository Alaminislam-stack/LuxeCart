/*
  Warnings:

  - Added the required column `updatedAt` to the `admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "adminId" TEXT;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
