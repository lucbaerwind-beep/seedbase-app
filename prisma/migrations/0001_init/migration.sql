-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPPLIER', 'ADMIN');

-- CreateEnum
CREATE TYPE "VarietyType" AS ENUM ('HYBRID', 'OPEN_POLLINATED');

-- CreateEnum
CREATE TYPE "VarietyStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'REPLIED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'SUPPLIER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierCompany" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "description" TEXT,
    "logoUrl" TEXT,
    "cropsFocus" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "SupplierCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variety" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" "VarietyType" NOT NULL,
    "growingCycle" TEXT,
    "traits" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "markets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "availability" TEXT,
    "minOrderNote" TEXT,
    "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "VarietyStatus" NOT NULL DEFAULT 'DRAFT',
    "varietyViews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supplierId" TEXT NOT NULL,
    CONSTRAINT "Variety_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "senderCompany" TEXT,
    "senderCountry" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repliedAt" TIMESTAMP(3),
    "supplierId" TEXT NOT NULL,
    "varietyId" TEXT,
    "recipientId" TEXT NOT NULL,
    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CertificationToSupplierCompany" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TagToVariety" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierCompany_slug_key" ON "SupplierCompany"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierCompany_ownerId_key" ON "SupplierCompany"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Variety_slug_key" ON "Variety"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Certification_name_key" ON "Certification"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Certification_slug_key" ON "Certification"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificationToSupplierCompany_AB_unique" ON "_CertificationToSupplierCompany"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificationToSupplierCompany_B_index" ON "_CertificationToSupplierCompany"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToVariety_AB_unique" ON "_TagToVariety"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToVariety_B_index" ON "_TagToVariety"("B");

-- AddForeignKey
ALTER TABLE "SupplierCompany" ADD CONSTRAINT "SupplierCompany_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variety" ADD CONSTRAINT "Variety_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "SupplierCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "SupplierCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_varietyId_fkey" FOREIGN KEY ("varietyId") REFERENCES "Variety"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificationToSupplierCompany" ADD CONSTRAINT "_CertificationToSupplierCompany_A_fkey" FOREIGN KEY ("A") REFERENCES "Certification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificationToSupplierCompany" ADD CONSTRAINT "_CertificationToSupplierCompany_B_fkey" FOREIGN KEY ("B") REFERENCES "SupplierCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToVariety" ADD CONSTRAINT "_TagToVariety_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToVariety" ADD CONSTRAINT "_TagToVariety_B_fkey" FOREIGN KEY ("B") REFERENCES "Variety"("id") ON DELETE CASCADE ON UPDATE CASCADE;
