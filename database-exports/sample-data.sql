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
