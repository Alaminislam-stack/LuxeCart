-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentStatus" TEXT DEFAULT 'pending';
