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


-- Sample Data
-- Sample Data for Real Estate Display System
-- Generated on: 2025-10-23T16:00:29.388Z

-- Sample admin user (password: admin123)
INSERT INTO "User" ("id", "email", "name", "password", "role", "companyLogoPath", "createdAt", "updatedAt") VALUES
('admin-user-1', 'admin@realestate.com', 'Admin User', '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSWLz0nD16', 'admin', NULL, '2025-10-23T16:00:29.388Z', '2025-10-23T16:00:29.388Z');

-- Sample display slots
INSERT INTO "Display" ("id", "address", "location", "price", "priceType", "bedrooms", "bathrooms", "garage", "livingroom", "propertyType", "description", "features", "contactNumber", "email", "sidebarColor", "sidebarPosition", "showCompanyLogo", "companyLogoPath", "showQrCode", "qrCodePath", "carouselEnabled", "carouselDuration", "carouselTransition", "mainImage", "image1", "image2", "image3", "createdAt", "updatedAt") VALUES
(1, '123 Test Street', 'City Center', '500', 'PCM', 4, 2, 1, 1, 'House', 'Beautiful family home in a prime location with spacious rooms.', 'Modern kitchen, Garden, Parking', '+1-555-0123', 'contact@realestate.com', '#22c353', 'right', true, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '2025-10-23T16:00:29.388Z', '2025-10-23T16:00:29.388Z'),
(2, '456 Oak Avenue', 'Suburb District', '750', 'PCM', 3, 2, 2, 1, 'Apartment', 'Modern apartment with city views and modern amenities.', 'Balcony, Gym, Pool', '+1-555-0124', 'info@realestate.com', '#3b82f6', 'left', false, NULL, true, NULL, true, 12000, 'slide', NULL, NULL, NULL, NULL, '2025-10-23T16:00:29.388Z', '2025-10-23T16:00:29.388Z'),
(3, '789 Pine Street', 'Downtown', '1200', 'PCM', 5, 3, 2, 2, 'House', 'Luxury family home with premium finishes and large garden.', 'Fireplace, Garden, Garage', '+1-555-0125', 'sales@realestate.com', '#8b5cf6', 'bottom', true, NULL, true, NULL, true, 18000, 'fade', NULL, NULL, NULL, NULL, '2025-10-23T16:00:29.388Z', '2025-10-23T16:00:29.388Z'),
(4, '321 Elm Road', 'Riverside', '600', 'PCM', 2, 1, 1, 1, 'Apartment', 'Cozy apartment perfect for young professionals.', 'River view, Modern kitchen', '+1-555-0126', 'rentals@realestate.com', '#f59e0b', 'right', false, NULL, false, NULL, true, 10000, 'fade', NULL, NULL, NULL, NULL, '2025-10-23T16:00:29.388Z', '2025-10-23T16:00:29.388Z'),
(5, '654 Maple Drive', 'Hillside', '900', 'PCM', 4, 2, 2, 1, 'House', 'Spacious family home with mountain views.', 'Mountain view, Large garden, Garage', '+1-555-0127', 'properties@realestate.com', '#10b981', 'left', true, NULL, true, NULL, true, 20000, 'slide', NULL, NULL, NULL, NULL, '2025-10-23T16:00:29.388Z', '2025-10-23T16:00:29.388Z');

-- Additional empty display slots (6-12)
INSERT INTO "Display" ("id", "address", "location", "price", "priceType", "bedrooms", "bathrooms", "garage", "livingroom", "propertyType", "description", "features", "contactNumber", "email", "sidebarColor", "sidebarPosition", "showCompanyLogo", "companyLogoPath", "showQrCode", "qrCodePath", "carouselEnabled", "carouselDuration", "carouselTransition", "mainImage", "image1", "image2", "image3", "createdAt", "updatedAt") VALUES
(6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '#22c353', 'right', false, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '2025-10-23T16:00:29.388Z', '2025-10-23T16:00:29.388Z'),
(7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '#22c353', 'right', false, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '2025-10-23T16:00:29.388Z', '2025-10-23T16:00:29.388Z'),
(8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '#22c353', 'right', false, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '2025-10-23T16:00:29.388Z', '2025-10-23T16:00:29.388Z'),
(9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '#22c353', 'right', false, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '2025-10-23T16:00:29.388Z', '2025-10-23T16:00:29.388Z'),
(10, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '#22c353', 'right', false, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '2025-10-23T16:00:29.388Z', '2025-10-23T16:00:29.388Z'),
(11, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '#22c353', 'right', false, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '2025-10-23T16:00:29.388Z', '2025-10-23T16:00:29.388Z'),
(12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '#22c353', 'right', false, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '2025-10-23T16:00:29.388Z', '2025-10-23T16:00:29.388Z');
