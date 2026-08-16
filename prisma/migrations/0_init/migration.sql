-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "neighbourhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "beds" INTEGER NOT NULL,
    "baths" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priceValue" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "imagePlaceholder" TEXT NOT NULL,
    "image" TEXT,
    "photoCount" INTEGER NOT NULL,
    "gallery" TEXT[],
    "description" TEXT NOT NULL,
    "rooms" JSONB NOT NULL,
    "floorPlans" JSONB,
    "principal" JSONB NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "interest" TEXT NOT NULL,
    "message" TEXT,
    "propertyId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'New',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencySettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "agencyName" TEXT NOT NULL DEFAULT 'Kreebz Ltd',
    "agencyEmail" TEXT NOT NULL DEFAULT 'hello@kreebzltd.com',
    "agencyPhone" TEXT NOT NULL DEFAULT '+234 806 994 9948',
    "agencyAddress" TEXT NOT NULL DEFAULT '',
    "principalName" TEXT NOT NULL DEFAULT 'Michael Eugene',
    "principalTitle" TEXT NOT NULL DEFAULT 'Key Principal',
    "notifyNewLeads" BOOLEAN NOT NULL DEFAULT true,
    "notifyEmail" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgencySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

