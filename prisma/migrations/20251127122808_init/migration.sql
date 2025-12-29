-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('EMPLOYEE', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('AVAILABLE', 'CHECKED_OUT', 'RETIRED');

-- CreateEnum
CREATE TYPE "CheckoutStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'RETURN_REQUESTED', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "RoleName" NOT NULL DEFAULT 'EMPLOYEE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "AssetType" (
    "typeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "AssetType_pkey" PRIMARY KEY ("typeId")
);

-- CreateTable
CREATE TABLE "Asset" (
    "assetId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'AVAILABLE',
    "typeId" TEXT NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("assetId")
);

-- CreateTable
CREATE TABLE "CheckoutRecord" (
    "recordId" TEXT NOT NULL,
    "checkoutDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnDate" TIMESTAMP(3),
    "status" "CheckoutStatus" NOT NULL DEFAULT 'PENDING',
    "assetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CheckoutRecord_pkey" PRIMARY KEY ("recordId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_label_key" ON "Asset"("label");

-- CreateIndex
CREATE INDEX "Asset_typeId_idx" ON "Asset"("typeId");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AssetType"("typeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutRecord" ADD CONSTRAINT "CheckoutRecord_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("assetId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutRecord" ADD CONSTRAINT "CheckoutRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
