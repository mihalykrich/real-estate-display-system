-- AlterTable
ALTER TABLE "Display" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bathrooms" INTEGER,
ADD COLUMN     "bedrooms" INTEGER,
ADD COLUMN     "carouselDuration" INTEGER DEFAULT 5000,
ADD COLUMN     "carouselEnabled" BOOLEAN DEFAULT false,
ADD COLUMN     "carouselTransition" TEXT DEFAULT 'fade',
ADD COLUMN     "companyLogoPath" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "features" TEXT,
ADD COLUMN     "garage" INTEGER,
ADD COLUMN     "image3" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "price" TEXT,
ADD COLUMN     "priceType" TEXT,
ADD COLUMN     "propertyType" TEXT,
ADD COLUMN     "showCompanyLogo" BOOLEAN DEFAULT false,
ADD COLUMN     "sidebarColor" TEXT DEFAULT '#7C3AED',
ADD COLUMN     "sidebarPosition" TEXT DEFAULT 'left';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "companyLogo" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "language" TEXT DEFAULT 'en',
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "timezone" TEXT DEFAULT 'Europe/London',
ADD COLUMN     "website" TEXT;
