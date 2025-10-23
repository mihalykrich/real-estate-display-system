-- Real Estate Display System Database Schema
-- Generated on: 2025-10-23T16:00:29.386Z

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "companyLogoPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Displays table
CREATE TABLE "Display" (
    "id" INTEGER NOT NULL,
    "address" TEXT,
    "location" TEXT,
    "price" TEXT,
    "priceType" TEXT,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "garage" INTEGER,
    "livingroom" INTEGER,
    "propertyType" TEXT,
    "description" TEXT,
    "features" TEXT,
    "contactNumber" TEXT,
    "email" TEXT,
    "sidebarColor" TEXT NOT NULL DEFAULT '#22c353',
    "sidebarPosition" TEXT NOT NULL DEFAULT 'right',
    "showCompanyLogo" BOOLEAN NOT NULL DEFAULT false,
    "companyLogoPath" TEXT,
    "showQrCode" BOOLEAN NOT NULL DEFAULT false,
    "qrCodePath" TEXT,
    "carouselEnabled" BOOLEAN NOT NULL DEFAULT true,
    "carouselDuration" INTEGER NOT NULL DEFAULT 15000,
    "carouselTransition" TEXT NOT NULL DEFAULT 'fade',
    "mainImage" TEXT,
    "image1" TEXT,
    "image2" TEXT,
    "image3" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Display_pkey" PRIMARY KEY ("id")
);

-- Scheduled Displays table
CREATE TABLE "ScheduledDisplay" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "displayId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "contentData" JSONB NOT NULL,
    "showQrCode" BOOLEAN NOT NULL DEFAULT false,
    "qrCodePath" TEXT,
    "showCompanyLogo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledDisplay_pkey" PRIMARY KEY ("id")
);

-- Scheduled Images table
CREATE TABLE "ScheduledImage" (
    "id" TEXT NOT NULL,
    "scheduledDisplayId" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "imageType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduledImage_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "ScheduledDisplay_displayId_idx" ON "ScheduledDisplay"("displayId");
CREATE INDEX "ScheduledImage_scheduledDisplayId_idx" ON "ScheduledImage"("scheduledDisplayId");

-- Foreign Keys
ALTER TABLE "ScheduledDisplay" ADD CONSTRAINT "ScheduledDisplay_displayId_fkey" FOREIGN KEY ("displayId") REFERENCES "Display"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ScheduledImage" ADD CONSTRAINT "ScheduledImage_scheduledDisplayId_fkey" FOREIGN KEY ("scheduledDisplayId") REFERENCES "ScheduledDisplay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
