# Raspberry Pi Deployment Guide
## Real Estate Display System

This comprehensive guide will help you deploy the Real Estate Display System on a Raspberry Pi for production use with A4 LCD displays.

---

## 📋 Prerequisites

### Hardware Requirements
- **Raspberry Pi 4** (4GB RAM minimum, 8GB recommended)
- **MicroSD Card** (32GB+ Class 10)
- **A4 LCD Display** (compatible with Raspberry Pi)
- **Power Supply** (5V 3A USB-C)
- **Ethernet Cable** or **WiFi** for internet connection
- **Keyboard & Mouse** (for initial setup)

### Software Requirements
- **Raspberry Pi OS** (64-bit recommended)
- **Node.js 18+**
- **Docker & Docker Compose**
- **Git**

---

## 🚀 Step 1: Raspberry Pi Setup

### 1.1 Install Raspberry Pi OS
1. Download **Raspberry Pi Imager** from [rpi.org](https://www.raspberrypi.org/downloads/)
2. Flash **Raspberry Pi OS (64-bit)** to your microSD card
3. Enable **SSH** and set up **WiFi** during imaging
4. Insert SD card and boot your Raspberry Pi

### 1.2 Initial System Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y git curl wget vim htop

# Set up SSH (if not done during imaging)
sudo systemctl enable ssh
sudo systemctl start ssh
```

### 1.3 Configure Display Settings
```bash
# Enable display auto-start
sudo raspi-config
# Navigate to: Advanced Options > Resolution
# Select: 1920x1080 (or your display's native resolution)
# Reboot when prompted
```

---

## 🐳 Step 2: Install Docker & Docker Compose

### 2.1 Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add pi user to docker group
sudo usermod -aG docker pi

# Enable Docker to start on boot
sudo systemctl enable docker
sudo systemctl start docker

# Verify installation
docker --version
```

### 2.2 Install Docker Compose
```bash
# Install Docker Compose
sudo apt install -y docker-compose

# Verify installation
docker-compose --version
```

---

## 📦 Step 3: Install Node.js

### 3.1 Install Node.js 18+
```bash
# Install Node.js using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

---

## 📥 Step 4: Deploy the Application

### 4.1 Clone the Repository
```bash
# Navigate to home directory
cd /home/pi

# Clone your repository
git clone https://github.com/mihalykrich/real-estate-display-system.git
cd real-estate-display-system
```

### 4.2 Set Up Environment Variables
```bash
# Navigate to webapp directory
cd webapp

# Create production environment file
cat > .env << 'EOF'
# Database configuration
DATABASE_URL="postgresql://realestate:realestate@localhost:5432/realestate?schema=public"

# NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-production-secret-key-change-this"

# File upload configuration
UPLOAD_DIR="public/uploads"
EOF

# Make the secret key more secure
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
```

### 4.3 Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install PM2 for process management
sudo npm install -g pm2
```

---

## 🗄️ Step 5: Database Setup

### 5.1 Start PostgreSQL Database
```bash
# Navigate to project root
cd /home/pi/real-estate-display-system

# Start PostgreSQL container
docker-compose up -d

# Verify database is running
docker ps
```

### 5.2 Initialize Database
```bash
# Navigate to webapp directory
cd webapp

# Push database schema
npx prisma db push

# Seed the database with 12 display slots
npx prisma db seed

# Create admin user
node scripts/create-admin.mjs
```

---

## 🚀 Step 6: Production Deployment

### 6.1 Build the Application
```bash
# Build the Next.js application
npm run build
```

### 6.2 Set Up PM2 Process Manager
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'real-estate-display',
    script: 'npm',
    args: 'start',
    cwd: '/home/pi/real-estate-display-system/webapp',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Start the application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above
```

---

## 🖥️ Step 7: Display Configuration

### 7.1 Install Chromium Browser
```bash
# Install Chromium
sudo apt install -y chromium-browser

# Create display script
cat > /home/pi/start-display.sh << 'EOF'
#!/bin/bash

# Kill any existing Chromium processes
pkill chromium-browser

# Wait a moment
sleep 2

# Start Chromium in kiosk mode
chromium-browser \
  --kiosk \
  --no-sandbox \
  --disable-dev-shm-usage \
  --disable-gpu \
  --disable-web-security \
  --disable-features=VizDisplayCompositor \
  --start-fullscreen \
  --app=http://localhost:3000/display/1 \
  --user-data-dir=/tmp/chrome-display
EOF

# Make script executable
chmod +x /home/pi/start-display.sh
```

### 7.2 Set Up Auto-Start Display
```bash
# Add to autostart
mkdir -p /home/pi/.config/autostart

cat > /home/pi/.config/autostart/real-estate-display.desktop << 'EOF'
[Desktop Entry]
Type=Application
Name=Real Estate Display
Exec=/home/pi/start-display.sh
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF
```

---

## 🔧 Step 8: System Optimization

### 8.1 Disable Unnecessary Services
```bash
# Disable unnecessary services to free up resources
sudo systemctl disable bluetooth
sudo systemctl disable hciuart
sudo systemctl disable wifi-powersave

# Disable desktop environment if using headless mode
# sudo systemctl set-default multi-user.target
```

### 8.2 Configure Swap (Optional)
```bash
# Increase swap size for better performance
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# Change CONF_SWAPSIZE=100 to CONF_SWAPSIZE=1024
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

### 8.3 Set Up Log Rotation
```bash
# Configure PM2 log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 🌐 Step 9: Network Configuration

### 9.1 Static IP Setup (Recommended)
```bash
# Configure static IP
sudo nano /etc/dhcpcd.conf

# Add the following (adjust for your network):
# interface eth0
# static ip_address=192.168.1.100/24
# static routers=192.168.1.1
# static domain_name_servers=8.8.8.8 8.8.4.4

# Restart networking
sudo systemctl restart dhcpcd
```

### 9.2 Firewall Configuration
```bash
# Install and configure UFW
sudo apt install -y ufw

# Allow SSH and HTTP
sudo ufw allow ssh
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw enable
```

---

## 📱 Step 10: Management & Monitoring

### 10.1 Access Points
- **Main Application**: `http://[PI_IP]:3000`
- **Admin Dashboard**: `http://[PI_IP]:3000/admin`
- **Display 1**: `http://[PI_IP]:3000/display/1`

### 10.2 Useful Commands
```bash
# Check application status
pm2 status

# View logs
pm2 logs real-estate-display

# Restart application
pm2 restart real-estate-display

# Check database status
docker ps

# Restart database
docker-compose restart

# Update application
cd /home/pi/real-estate-display-system
git pull
cd webapp
npm run build
pm2 restart real-estate-display
```

### 10.3 Remote Management
```bash
# Enable SSH access (if not already enabled)
sudo systemctl enable ssh
sudo systemctl start ssh

# Access via SSH from another computer
# ssh pi@[PI_IP]
```

---

## 🔄 Step 11: Maintenance & Updates

### 11.1 Automated Updates Script
```bash
# Create update script
cat > /home/pi/update-app.sh << 'EOF'
#!/bin/bash
cd /home/pi/real-estate-display-system
git pull
cd webapp
npm install
npm run build
pm2 restart real-estate-display
echo "Application updated successfully"
EOF

chmod +x /home/pi/update-app.sh
```

### 11.2 Backup Script
```bash
# Create backup script
cat > /home/pi/backup-app.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/pi/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker exec real-estate-db-1 pg_dump -U realestate realestate > $BACKUP_DIR/db_backup_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /home/pi/real-estate-display-system/webapp/public/uploads

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /home/pi/backup-app.sh

# Set up daily backup
echo "0 2 * * * /home/pi/backup-app.sh" | crontab -
```

---

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Application Won't Start
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs real-estate-display

# Restart everything
pm2 restart all
docker-compose restart
```

#### Database Connection Issues
```bash
# Check if database is running
docker ps

# Restart database
docker-compose down
docker-compose up -d

# Check database logs
docker logs real-estate-db-1
```

#### Display Not Showing
```bash
# Restart display script
pkill chromium-browser
/home/pi/start-display.sh

# Check if application is accessible
curl http://localhost:3000
```

#### Performance Issues
```bash
# Check system resources
htop

# Check PM2 memory usage
pm2 monit

# Restart application
pm2 restart real-estate-display
```

---

## 📊 Monitoring Dashboard

### System Health Check Script
```bash
cat > /home/pi/health-check.sh << 'EOF'
#!/bin/bash
echo "=== Real Estate Display System Health Check ==="
echo "Date: $(date)"
echo

echo "1. Application Status:"
pm2 status
echo

echo "2. Database Status:"
docker ps | grep real-estate
echo

echo "3. System Resources:"
free -h
echo

echo "4. Disk Usage:"
df -h
echo

echo "5. Network Status:"
ping -c 1 google.com > /dev/null && echo "Internet: Connected" || echo "Internet: Disconnected"
echo

echo "6. Application Response:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000
EOF

chmod +x /home/pi/health-check.sh
```

---

## 🎯 Final Checklist

- [ ] Raspberry Pi OS installed and updated
- [ ] Docker and Docker Compose installed
- [ ] Node.js 18+ installed
- [ ] Application cloned and dependencies installed
- [ ] Environment variables configured
- [ ] Database started and initialized
- [ ] Application built and running with PM2
- [ ] Chromium installed and display script created
- [ ] Auto-start configured
- [ ] Static IP configured (optional)
- [ ] Firewall configured
- [ ] Backup script set up
- [ ] Health check script created
- [ ] Application accessible via web browser

---

## 📞 Support

For issues specific to this deployment:
1. Check the troubleshooting section above
2. Review PM2 logs: `pm2 logs real-estate-display`
3. Check Docker logs: `docker logs real-estate-db-1`
4. Run health check: `/home/pi/health-check.sh`

For application-specific issues, refer to the main [GitHub repository](https://github.com/mihalykrich/real-estate-display-system).

---

**🎉 Congratulations! Your Real Estate Display System is now running on Raspberry Pi!**

The system will automatically start on boot and display your property listings on the A4 LCD screen. You can manage the displays remotely through the admin dashboard at `http://[PI_IP]:3000/admin`.
