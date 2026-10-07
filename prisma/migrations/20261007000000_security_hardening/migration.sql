-- AlterTable
ALTER TABLE "Jet" ALTER COLUMN "baseHourlyRate" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "JetBooking" ADD COLUMN     "checkoutUrl" TEXT,
ADD COLUMN     "paymentInitiatedAt" TIMESTAMP(3),
ALTER COLUMN "totalAmount" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tokenVersion" INTEGER NOT NULL DEFAULT 0;
