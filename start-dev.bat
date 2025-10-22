@echo off
echo ========================================
echo Real Estate Display System - Dev Server
echo ========================================
cd /d "C:\xampp\htdocs\dashboard\Projects\real_estate\webapp"
set DATABASE_URL=postgresql://realestate:realestate@localhost:5432/realestate?schema=public
echo Starting development server from: %CD%
echo Database URL: %DATABASE_URL%
echo.
echo Server will be available at:
echo - Main site: http://localhost:3000
echo - Admin dashboard: http://localhost:3000/admin
echo - Display 1: http://localhost:3000/display/1
echo.
echo Press Ctrl+C to stop the server
echo ========================================
npm run dev
