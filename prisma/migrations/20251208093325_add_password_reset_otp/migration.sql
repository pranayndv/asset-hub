-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetOtp" TEXT,
ADD COLUMN     "resetOtpExp" TIMESTAMP(3);
