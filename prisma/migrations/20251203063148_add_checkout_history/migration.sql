-- CreateTable
CREATE TABLE "CheckoutHistory" (
    "historyId" TEXT NOT NULL,
    "actionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionType" "CheckoutStatus" NOT NULL,
    "recordId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionById" TEXT NOT NULL,

    CONSTRAINT "CheckoutHistory_pkey" PRIMARY KEY ("historyId")
);

-- AddForeignKey
ALTER TABLE "CheckoutHistory" ADD CONSTRAINT "CheckoutHistory_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "CheckoutRecord"("recordId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutHistory" ADD CONSTRAINT "CheckoutHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutHistory" ADD CONSTRAINT "CheckoutHistory_actionById_fkey" FOREIGN KEY ("actionById") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
