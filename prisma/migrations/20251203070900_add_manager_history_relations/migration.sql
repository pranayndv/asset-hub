-- AlterTable
ALTER TABLE "CheckoutHistory" ALTER COLUMN "actionById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "managerId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
