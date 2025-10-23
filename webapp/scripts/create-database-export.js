const fs = require('fs');
const path = require('path');

// Create a basic database export
async function createDatabaseExport() {
  try {
    console.log('🔄 Creating database export...');
    
    // Create exports directory
    const exportsDir = path.join(__dirname, '..', '..', 'database-exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    
    // Create schema SQL
    const schemaSQL = `-- Real Estate Display System Database Schema
-- Generated on: ${new Date().toISOString()}

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
`;

    // Create sample data SQL
    const sampleDataSQL = `-- Sample Data for Real Estate Display System
-- Generated on: ${new Date().toISOString()}

-- Sample admin user (password: admin123)
INSERT INTO "User" ("id", "email", "name", "password", "role", "companyLogoPath", "createdAt", "updatedAt") VALUES
('admin-user-1', 'admin@realestate.com', 'Admin User', '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSWLz0nD16', 'admin', NULL, '${new Date().toISOString()}', '${new Date().toISOString()}');

-- Sample display slots
INSERT INTO "Display" ("id", "address", "location", "price", "priceType", "bedrooms", "bathrooms", "garage", "livingroom", "propertyType", "description", "features", "contactNumber", "email", "sidebarColor", "sidebarPosition", "showCompanyLogo", "companyLogoPath", "showQrCode", "qrCodePath", "carouselEnabled", "carouselDuration", "carouselTransition", "mainImage", "image1", "image2", "image3", "createdAt", "updatedAt") VALUES
(1, '123 Test Street', 'City Center', '500', 'PCM', 4, 2, 1, 1, 'House', 'Beautiful family home in a prime location with spacious rooms.', 'Modern kitchen, Garden, Parking', '+1-555-0123', 'contact@realestate.com', '#22c353', 'right', true, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '${new Date().toISOString()}', '${new Date().toISOString()}'),
(2, '456 Oak Avenue', 'Suburb District', '750', 'PCM', 3, 2, 2, 1, 'Apartment', 'Modern apartment with city views and modern amenities.', 'Balcony, Gym, Pool', '+1-555-0124', 'info@realestate.com', '#3b82f6', 'left', false, NULL, true, NULL, true, 12000, 'slide', NULL, NULL, NULL, NULL, '${new Date().toISOString()}', '${new Date().toISOString()}'),
(3, '789 Pine Street', 'Downtown', '1200', 'PCM', 5, 3, 2, 2, 'House', 'Luxury family home with premium finishes and large garden.', 'Fireplace, Garden, Garage', '+1-555-0125', 'sales@realestate.com', '#8b5cf6', 'bottom', true, NULL, true, NULL, true, 18000, 'fade', NULL, NULL, NULL, NULL, '${new Date().toISOString()}', '${new Date().toISOString()}'),
(4, '321 Elm Road', 'Riverside', '600', 'PCM', 2, 1, 1, 1, 'Apartment', 'Cozy apartment perfect for young professionals.', 'River view, Modern kitchen', '+1-555-0126', 'rentals@realestate.com', '#f59e0b', 'right', false, NULL, false, NULL, true, 10000, 'fade', NULL, NULL, NULL, NULL, '${new Date().toISOString()}', '${new Date().toISOString()}'),
(5, '654 Maple Drive', 'Hillside', '900', 'PCM', 4, 2, 2, 1, 'House', 'Spacious family home with mountain views.', 'Mountain view, Large garden, Garage', '+1-555-0127', 'properties@realestate.com', '#10b981', 'left', true, NULL, true, NULL, true, 20000, 'slide', NULL, NULL, NULL, NULL, '${new Date().toISOString()}', '${new Date().toISOString()}');

-- Additional empty display slots (6-12)
INSERT INTO "Display" ("id", "address", "location", "price", "priceType", "bedrooms", "bathrooms", "garage", "livingroom", "propertyType", "description", "features", "contactNumber", "email", "sidebarColor", "sidebarPosition", "showCompanyLogo", "companyLogoPath", "showQrCode", "qrCodePath", "carouselEnabled", "carouselDuration", "carouselTransition", "mainImage", "image1", "image2", "image3", "createdAt", "updatedAt") VALUES
(6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '#22c353', 'right', false, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '${new Date().toISOString()}', '${new Date().toISOString()}'),
(7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '#22c353', 'right', false, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '${new Date().toISOString()}', '${new Date().toISOString()}'),
(8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '#22c353', 'right', false, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '${new Date().toISOString()}', '${new Date().toISOString()}'),
(9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '#22c353', 'right', false, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '${new Date().toISOString()}', '${new Date().toISOString()}'),
(10, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '#22c353', 'right', false, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '${new Date().toISOString()}', '${new Date().toISOString()}'),
(11, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '#22c353', 'right', false, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '${new Date().toISOString()}', '${new Date().toISOString()}'),
(12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '#22c353', 'right', false, NULL, false, NULL, true, 15000, 'fade', NULL, NULL, NULL, NULL, '${new Date().toISOString()}', '${new Date().toISOString()}');
`;

    // Create complete database SQL
    const completeSQL = schemaSQL + '\n\n-- Sample Data\n' + sampleDataSQL;

    // Create JSON export
    const jsonExport = {
      exportInfo: {
        generatedAt: new Date().toISOString(),
        version: '1.0',
        description: 'Real Estate Display System Database Export',
        tables: ['User', 'Display', 'ScheduledDisplay', 'ScheduledImage']
      },
      schema: {
        User: {
          fields: ['id', 'email', 'name', 'password', 'role', 'companyLogoPath', 'createdAt', 'updatedAt'],
          indexes: ['User_email_key'],
          constraints: ['User_pkey']
        },
        Display: {
          fields: ['id', 'address', 'location', 'price', 'priceType', 'bedrooms', 'bathrooms', 'garage', 'livingroom', 'propertyType', 'description', 'features', 'contactNumber', 'email', 'sidebarColor', 'sidebarPosition', 'showCompanyLogo', 'companyLogoPath', 'showQrCode', 'qrCodePath', 'carouselEnabled', 'carouselDuration', 'carouselTransition', 'mainImage', 'image1', 'image2', 'image3', 'createdAt', 'updatedAt'],
          indexes: [],
          constraints: ['Display_pkey']
        },
        ScheduledDisplay: {
          fields: ['id', 'name', 'description', 'displayId', 'startDate', 'endDate', 'isActive', 'contentData', 'showQrCode', 'qrCodePath', 'showCompanyLogo', 'createdAt', 'updatedAt'],
          indexes: ['ScheduledDisplay_displayId_idx'],
          constraints: ['ScheduledDisplay_pkey', 'ScheduledDisplay_displayId_fkey']
        },
        ScheduledImage: {
          fields: ['id', 'scheduledDisplayId', 'imagePath', 'imageType', 'createdAt'],
          indexes: ['ScheduledImage_scheduledDisplayId_idx'],
          constraints: ['ScheduledImage_pkey', 'ScheduledImage_scheduledDisplayId_fkey']
        }
      },
      sampleData: {
        users: [
          {
            id: 'admin-user-1',
            email: 'admin@realestate.com',
            name: 'Admin User',
            role: 'admin',
            companyLogoPath: null
          }
        ],
        displays: [
          {
            id: 1,
            address: '123 Test Street',
            location: 'City Center',
            price: '500',
            priceType: 'PCM',
            bedrooms: 4,
            bathrooms: 2,
            garage: 1,
            livingroom: 1,
            propertyType: 'House',
            description: 'Beautiful family home in a prime location with spacious rooms.',
            features: 'Modern kitchen, Garden, Parking',
            contactNumber: '+1-555-0123',
            email: 'contact@realestate.com',
            sidebarColor: '#22c353',
            sidebarPosition: 'right',
            showCompanyLogo: true,
            showQrCode: false,
            carouselEnabled: true,
            carouselDuration: 15000,
            carouselTransition: 'fade'
          },
          {
            id: 2,
            address: '456 Oak Avenue',
            location: 'Suburb District',
            price: '750',
            priceType: 'PCM',
            bedrooms: 3,
            bathrooms: 2,
            garage: 2,
            livingroom: 1,
            propertyType: 'Apartment',
            description: 'Modern apartment with city views and modern amenities.',
            features: 'Balcony, Gym, Pool',
            contactNumber: '+1-555-0124',
            email: 'info@realestate.com',
            sidebarColor: '#3b82f6',
            sidebarPosition: 'left',
            showCompanyLogo: false,
            showQrCode: true,
            carouselEnabled: true,
            carouselDuration: 12000,
            carouselTransition: 'slide'
          }
        ]
      }
    };

    // Write files
    fs.writeFileSync(path.join(exportsDir, 'schema.sql'), schemaSQL);
    fs.writeFileSync(path.join(exportsDir, 'sample-data.sql'), sampleDataSQL);
    fs.writeFileSync(path.join(exportsDir, 'complete-database.sql'), completeSQL);
    fs.writeFileSync(path.join(exportsDir, 'database-export.json'), JSON.stringify(jsonExport, null, 2));

    // Create README
    const readmeContent = `# Database Exports

This directory contains database exports for the Real Estate Display System.

## Files

- **schema.sql** - Database schema only (tables, indexes, constraints)
- **sample-data.sql** - Sample data for testing and demos
- **complete-database.sql** - Complete database (schema + sample data)
- **database-export.json** - JSON format export with metadata

## Usage

### Restore Complete Database
\`\`\`bash
psql -h localhost -U realestate -d realestate -f complete-database.sql
\`\`\`

### Restore Schema Only
\`\`\`bash
psql -h localhost -U realestate -d realestate -f schema.sql
\`\`\`

### Restore Sample Data Only
\`\`\`bash
psql -h localhost -U realestate -d realestate -f sample-data.sql
\`\`\`

## Sample Data Includes

- 1 Admin user (email: admin@realestate.com, password: admin123)
- 5 Sample property displays with different configurations
- 7 Empty display slots (6-12) for testing

## Generated

Generated on: ${new Date().toISOString()}
Version: 1.0
`;

    fs.writeFileSync(path.join(exportsDir, 'README.md'), readmeContent);

    console.log('✅ Database export completed successfully!');
    console.log(`📁 Files saved to: ${exportsDir}`);
    console.log('📋 Files created:');
    console.log('   - schema.sql (database structure)');
    console.log('   - sample-data.sql (sample data)');
    console.log('   - complete-database.sql (schema + data)');
    console.log('   - database-export.json (JSON format)');
    console.log('   - README.md (usage instructions)');

  } catch (error) {
    console.error('❌ Error creating database export:', error);
  }
}

// Run the export
createDatabaseExport();
