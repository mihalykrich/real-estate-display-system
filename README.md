# Real Estate Display System

A modern, professional real estate window display system built with Next.js 14, featuring customizable digital property listings for Raspberry Pi-powered A4 LCD screens.

## 🏠 Features

### **Professional Property Displays**
- **Customizable Sidebar Colors**: Each display can have its own unique color scheme
- **Comprehensive Property Details**: Address, location, price, bedrooms, bathrooms, garage spaces
- **Multiple Image Support**: Main property image + 3 interior images in a clean row layout
- **QR Code Integration**: Generate QR codes from URLs for additional information
- **Responsive Design**: Optimized for A4 LCD displays and various screen sizes

### **Admin Dashboard**
- **Modern Interface**: Clean, professional admin panel with organized sections
- **12 Display Slots**: Manage up to 12 different property displays
- **Drag & Drop Uploads**: Easy image management with drag-and-drop functionality
- **Image Management**: Delete, swap, and organize images between slots
- **Real-time Updates**: Changes reflect immediately on display screens

### **Authentication & Security**
- **NextAuth v5 Integration**: Secure credentials-based authentication
- **Protected Routes**: Admin dashboard requires authentication
- **User Management**: Registration and login system for admin access

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth v5 (Credentials Provider)
- **File Storage**: Local filesystem with organized upload structure
- **QR Code Generation**: qrcode library
- **Styling**: Tailwind CSS with custom components

## 📁 Project Structure

```
real_estate/
├── webapp/                          # Next.js application
│   ├── src/
│   │   ├── app/                     # App Router pages
│   │   │   ├── (auth)/              # Authentication pages
│   │   │   ├── admin/               # Admin dashboard
│   │   │   ├── display/             # Display pages
│   │   │   └── api/                 # API routes
│   │   ├── components/              # Reusable components
│   │   └── lib/                     # Utilities and configurations
│   ├── prisma/                      # Database schema and migrations
│   ├── public/                      # Static assets
│   └── scripts/                     # Utility scripts
├── docker-compose.yml               # PostgreSQL database setup
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Docker (for PostgreSQL)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd real_estate
   ```

2. **Set up the database**
   ```bash
   docker-compose up -d
   ```

3. **Install dependencies**
   ```bash
   cd webapp
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

5. **Initialize the database**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

6. **Create an admin user**
   ```bash
   node scripts/create-admin.mjs
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Access the application**
   - Main site: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin
   - Display 1: http://localhost:3000/display/1

## 📱 Usage

### **Admin Dashboard**
1. **Login**: Use the credentials created by the admin script
2. **Manage Displays**: Click "Edit Content" on any display slot
3. **Add Property Details**: Fill in address, location, price, features
4. **Upload Images**: Drag and drop images for main and interior views
5. **Customize Colors**: Choose sidebar colors for each display
6. **Generate QR Codes**: Create QR codes from URLs
7. **Preview**: Click "View Display" to see the final result

### **Display Management**
- **12 Display Slots**: Each slot can show a different property
- **Image Organization**: Main image + 3 interior images in a row
- **Color Customization**: Each display can have unique sidebar colors
- **Contact Information**: Phone and email for each property
- **QR Code Integration**: Additional information via QR codes

## 🎨 Customization

### **Display Colors**
Each display can have its own sidebar color:
- Use the color picker in the admin interface
- Colors are stored per display in the database
- Gradient effects are automatically applied

### **Image Layout**
- **Main Image**: Large property photo (4:3 aspect ratio)
- **Interior Images**: 3 square images in a horizontal row
- **QR Code**: Positioned at bottom of sidebar

### **Property Details**
- **Basic Info**: Address, location, price, price type
- **Features**: Bedrooms, bathrooms, garage spaces
- **Content**: Description and key features list
- **Contact**: Phone number and email

## 🔧 Development

### **Database Schema**
The system uses Prisma with PostgreSQL:
- **User**: Authentication and user management
- **Display**: Property information and display settings
- **Account/Session**: NextAuth session management

### **File Structure**
- **Uploads**: Organized by display ID (`public/uploads/{id}/`)
- **Images**: Automatically named with timestamps
- **QR Codes**: Generated from URLs and stored as PNG files

### **API Endpoints**
- **Authentication**: `/api/auth/*` (NextAuth routes)
- **Registration**: `/api/register` (User creation)
- **Display Management**: Server actions in admin pages

## 📊 Database Seeding

The system comes with:
- **12 Empty Display Slots**: Ready for property information
- **Admin User**: Created via script for initial access
- **Default Settings**: Sensible defaults for all fields

## 🚀 Deployment

### **Production Setup**
1. **Environment Variables**: Set production database URL
2. **File Storage**: Consider cloud storage for production
3. **Domain Configuration**: Set up proper domain and SSL
4. **Database**: Use managed PostgreSQL service

### **Raspberry Pi Setup**
- **Display Screens**: A4 LCD screens for window displays
- **Browser**: Chromium in kiosk mode
- **Auto-refresh**: JavaScript to refresh displays periodically
- **Network**: Ensure stable internet connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

---

**Built with ❤️ for modern real estate marketing**
