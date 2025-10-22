# Raspberry Pi Deployment Guide
## Real Estate Display System - Server & Client Architecture

This comprehensive guide will help you deploy the Real Estate Display System using a **server-client architecture** with one central server Raspberry Pi managing multiple display Raspberry Pi clients.

---

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Server Pi     │    │   Display Pi 1  │    │   Display Pi 2  │
│   (Pi 4/5 8GB)  │◄───┤   (Pi Zero 2W)  │    │   (Pi Zero 2W)  │
│                 │    │                 │    │                 │
│ • Next.js App   │    │ • Chromium      │    │ • Chromium      │
│ • PostgreSQL    │    │ • Kiosk Mode    │    │ • Kiosk Mode    │
│ • Admin Panel   │    │ • Auto-refresh  │    │ • Auto-refresh  │
│ • File Storage  │    │ • Display 1     │    │ • Display 2     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Display Pi N  │
                    │   (Pi Zero 2W)  │
                    │                 │
                    │ • Chromium      │
                    │ • Kiosk Mode    │
                    │ • Auto-refresh  │
                    │ • Display N     │
                    └─────────────────┘
```

---

## 📋 Prerequisites

### Server Raspberry Pi Requirements
- **Raspberry Pi 4 (8GB RAM)** or **Raspberry Pi 5 (8GB RAM)**
- **MicroSD Card** (64GB+ Class 10)
- **Power Supply** (5V 3A USB-C)
- **Ethernet Cable** (wired connection recommended)
- **Keyboard & Mouse** (for initial setup)

### Display Raspberry Pi Requirements
- **Raspberry Pi Zero 2 W** (recommended) or **Raspberry Pi 4 (2GB RAM)**
- **MicroSD Card** (16GB Class 10)
- **A4 LCD Display** (compatible with Raspberry Pi)
- **Power Supply** (5V 2.5A for Zero 2W, 5V 3A for Pi 4)
- **WiFi** (for Zero 2W) or **Ethernet** (for Pi 4)

### Software Requirements
- **Raspberry Pi OS** (64-bit recommended)
- **Node.js 18+** (Server only)
- **Docker & Docker Compose** (Server only)
- **Git** (Server only)

---

## 🖥️ PART A: SERVER RASPBERRY PI SETUP

---

## 🚀 Step 1: Server Pi Initial Setup

### 1.1 Install Raspberry Pi OS (Server)
1. Download **Raspberry Pi Imager** from [rpi.org](https://www.raspberrypi.org/downloads/)
2. Flash **Raspberry Pi OS (64-bit)** to your **64GB+ microSD card**
3. Enable **SSH** and set up **WiFi/Ethernet** during imaging
4. Insert SD card and boot your **Server Raspberry Pi**

### 1.2 Server System Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y git curl wget vim htop

# Set up SSH (if not done during imaging)
sudo systemctl enable ssh
sudo systemctl start ssh

# Set static IP (recommended for server)
sudo nano /etc/dhcpcd.conf
# Add:
# interface eth0
# static ip_address=192.168.1.100/24
# static routers=192.168.1.1
# static domain_name_servers=8.8.8.8 8.8.4.4
```

---

## 🐳 Step 2: Install Docker & Docker Compose (Server Only)

### 2.1 Install Docker on Server Pi
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

### 2.2 Install Docker Compose on Server Pi
```bash
# Install Docker Compose
sudo apt install -y docker-compose

# Verify installation
docker-compose --version
```

---

## 📦 Step 3: Install Node.js (Server Only)

### 3.1 Install Node.js 18+ on Server Pi
```bash
# Install Node.js using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

---

## 🌐 Step 4: Network Configuration (Server)

### 4.1 Configure Server Network Access
```bash
# Configure firewall to allow client connections
sudo apt install -y ufw

# Allow SSH and HTTP
sudo ufw allow ssh
sudo ufw allow 3000/tcp

# Enable firewall
sudo ufw enable

# Note your server IP address
hostname -I
```

---

## 📥 Step 5: Deploy the Application (Server)

### 5.1 Clone the Repository
```bash
# Navigate to home directory
cd /home/pi

# Clone your repository
git clone https://github.com/mihalykrich/real-estate-display-system.git
cd real-estate-display-system
```

### 5.2 Set Up Environment Variables
```bash
# Navigate to webapp directory
cd webapp

# Create production environment file
cat > .env << 'EOF'
# Database configuration
DATABASE_URL="postgresql://realestate:realestate@localhost:5432/realestate?schema=public"

# NextAuth configuration
NEXTAUTH_URL="http://192.168.1.100:3000"
NEXTAUTH_SECRET="your-production-secret-key-change-this"

# File upload configuration
UPLOAD_DIR="public/uploads"
EOF

# Make the secret key more secure
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
```

### 5.3 Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install PM2 for process management
sudo npm install -g pm2
```

---

## 🗄️ Step 6: Database Setup (Server)

### 6.1 Start PostgreSQL Database
```bash
# Navigate to project root
cd /home/pi/real-estate-display-system

# Start PostgreSQL container
docker-compose up -d

# Verify database is running
docker ps
```

### 6.2 Initialize Database
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

## 🚀 Step 7: Production Deployment (Server)

### 7.1 Build the Application
```bash
# Build the Next.js application
npm run build
```

### 7.2 Set Up PM2 Process Manager
```bash
# Create PM2 ecosystem file with explicit database URL
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'real-estate-display-server',
    script: 'npm',
    args: 'start',
    cwd: '/home/pi/real-estate-display-system/webapp',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: 'postgresql://realestate:realestate@localhost:5432/realestate?schema=public'
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

### 7.3 Create Reliable Startup Script
```bash
# Create a startup script for manual server restart
cat > /home/pi/start-server.sh << 'EOF'
#!/bin/bash
echo "Starting Real Estate Display Server..."
cd /home/pi/real-estate-display-system/webapp

# Ensure correct environment
export DATABASE_URL="postgresql://realestate:realestate@localhost:5432/realestate?schema=public"
export NODE_ENV="production"

# Start with PM2
pm2 start ecosystem.config.js
echo "Server started successfully!"
echo "Access at: http://$(hostname -I | awk '{print $1}'):3000"
EOF

chmod +x /home/pi/start-server.sh
```

---

## 🖥️ PART B: DISPLAY RASPBERRY PI CLIENT SETUP

---

## 🚀 Step 8: Display Pi Initial Setup

### 8.1 Install Raspberry Pi OS (Display Client)
1. Download **Raspberry Pi Imager** from [rpi.org](https://www.raspberrypi.org/downloads/)
2. Flash **Raspberry Pi OS Lite (64-bit)** to your **16GB microSD card**
3. Enable **SSH** and set up **WiFi** during imaging
4. Insert SD card and boot your **Display Raspberry Pi**

### 8.2 Display Pi System Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget

# Set up SSH
sudo systemctl enable ssh
sudo systemctl start ssh

# Configure WiFi (if using Pi Zero 2W)
sudo raspi-config
# Navigate to: System Options > Wireless LAN
# Enter your WiFi credentials
```

### 8.3 Configure Display Settings
```bash
# Enable display auto-start
sudo raspi-config
# Navigate to: Advanced Options > Resolution
# Select: 1920x1080 (or your display's native resolution)
# Reboot when prompted
```

## 🖥️ Step 9: Display Client Configuration

### 9.1 Install Chromium Browser
```bash
# Install Chromium
sudo apt install -y chromium-browser

# Create display configuration script
cat > /home/pi/configure-display.sh << 'EOF'
#!/bin/bash

# Get display ID from command line argument
DISPLAY_ID=${1:-1}
SERVER_IP=${2:-"192.168.1.100"}

echo "Configuring Display Pi for Display ID: $DISPLAY_ID"
echo "Connecting to Server: $SERVER_IP"

# Create display script
cat > /home/pi/start-display.sh << EOL
#!/bin/bash

# Kill any existing Chromium processes
pkill chromium-browser

# Wait a moment
sleep 2

# Start Chromium in kiosk mode
chromium-browser \\
  --kiosk \\
  --no-sandbox \\
  --disable-dev-shm-usage \\
  --disable-gpu \\
  --disable-web-security \\
  --disable-features=VizDisplayCompositor \\
  --start-fullscreen \\
  --app=http://$SERVER_IP:3000/display/$DISPLAY_ID \\
  --user-data-dir=/tmp/chrome-display-$DISPLAY_ID
EOL

# Make script executable
chmod +x /home/pi/start-display.sh

echo "Display configuration complete!"
echo "Display will show: http://$SERVER_IP:3000/display/$DISPLAY_ID"
EOF

# Make configuration script executable
chmod +x /home/pi/configure-display.sh
```

### 9.2 Configure Display Client
```bash
# Configure this display (replace 1 with your display number)
# Replace 192.168.1.100 with your server IP
./configure-display.sh 1 192.168.1.100

# Set up auto-start
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

### 9.3 Test Display Connection
```bash
# Test connection to server
curl http://192.168.1.100:3000

# If successful, start display
/home/pi/start-display.sh
```

---

## 🔧 Step 10: System Optimization (Both Server & Clients)

### 10.1 Disable Unnecessary Services (Both Server & Clients)
```bash
# Disable unnecessary services to free up resources
sudo systemctl disable bluetooth
sudo systemctl disable hciuart
sudo systemctl disable wifi-powersave

# For display clients only - disable desktop environment
# sudo systemctl set-default multi-user.target
```

### 10.2 Configure Swap (Server Only)
```bash
# Increase swap size for better performance
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# Change CONF_SWAPSIZE=100 to CONF_SWAPSIZE=1024
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

### 10.3 Set Up Log Rotation (Server Only)
```bash
# Configure PM2 log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 📱 Step 11: Management & Monitoring

### 11.1 Access Points
- **Server Admin Dashboard**: `http://[SERVER_IP]:3000/admin`
- **Display 1**: `http://[SERVER_IP]:3000/display/1`
- **Display 2**: `http://[SERVER_IP]:3000/display/2`
- **Display N**: `http://[SERVER_IP]:3000/display/N`

### 11.2 Server Management Commands
```bash
# Check application status
pm2 status

# View logs
pm2 logs real-estate-display-server

# Restart application
pm2 restart real-estate-display-server

# Check database status
docker ps

# Restart database
docker-compose restart
```

### 11.3 Display Client Management
```bash
# SSH into display client
ssh pi@[DISPLAY_IP]

# Check display status
ps aux | grep chromium

# Restart display
pkill chromium-browser
/home/pi/start-display.sh

# Update display configuration
./configure-display.sh [DISPLAY_ID] [SERVER_IP]
```

### 11.4 Remote Management Script
```bash
# Create management script on server
cat > /home/pi/manage-displays.sh << 'EOF'
#!/bin/bash

# List of display IPs (update with your actual IPs)
DISPLAY_IPS=("192.168.1.101" "192.168.1.102" "192.168.1.103")

echo "=== Real Estate Display System Management ==="
echo "Server Status:"
pm2 status
echo

echo "Database Status:"
docker ps | grep real-estate
echo

echo "Display Status:"
for ip in "${DISPLAY_IPS[@]}"; do
    echo "Display $ip:"
    ssh -o ConnectTimeout=5 pi@$ip "ps aux | grep chromium | grep -v grep" || echo "  - Not responding"
done
EOF

chmod +x /home/pi/manage-displays.sh
```

---

## 🔄 Step 12: Maintenance & Updates

### 12.1 Server Updates
```bash
# Create update script on server
cat > /home/pi/update-server.sh << 'EOF'
#!/bin/bash
cd /home/pi/real-estate-display-system
git pull
cd webapp
npm install
npm run build
pm2 restart real-estate-display-server
echo "Server updated successfully"
EOF

chmod +x /home/pi/update-server.sh
```

### 12.2 Display Client Updates
```bash
# Create update script for display clients
cat > /home/pi/update-display.sh << 'EOF'
#!/bin/bash
# This script should be run on each display client
# Update display configuration if server IP changes
SERVER_IP=${1:-"192.168.1.100"}
DISPLAY_ID=${2:-"1"}

echo "Updating display client configuration..."
./configure-display.sh $DISPLAY_ID $SERVER_IP
echo "Display client updated successfully"
EOF

chmod +x /home/pi/update-display.sh
```

### 12.3 Backup Script (Server Only)
```bash
# Create backup script
cat > /home/pi/backup-server.sh << 'EOF'
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

chmod +x /home/pi/backup-server.sh

# Set up daily backup
echo "0 2 * * * /home/pi/backup-server.sh" | crontab -
```

---

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Server Issues
```bash
# Application won't start
pm2 status
pm2 logs real-estate-display-server
pm2 restart all

# Database connection issues
docker ps
docker-compose restart
docker logs real-estate-db-1
```

#### Display Client Issues
```bash
# Display not showing
ssh pi@[DISPLAY_IP]
ps aux | grep chromium
pkill chromium-browser
/home/pi/start-display.sh

# Connection to server failed
curl http://[SERVER_IP]:3000
ping [SERVER_IP]
```

#### Network Issues
```bash
# Check network connectivity
ping google.com
ping [SERVER_IP]

# Check firewall
sudo ufw status
sudo ufw allow 3000/tcp
```

---

## 📊 Health Monitoring

### System Health Check Script (Server)
```bash
cat > /home/pi/health-check.sh << 'EOF'
#!/bin/bash
echo "=== Real Estate Display System Health Check ==="
echo "Date: $(date)"
echo

echo "1. Server Application Status:"
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
echo

echo "7. Display Client Status:"
DISPLAY_IPS=("192.168.1.101" "192.168.1.102" "192.168.1.103")
for ip in "${DISPLAY_IPS[@]}"; do
    echo "Display $ip:"
    ssh -o ConnectTimeout=5 pi@$ip "ps aux | grep chromium | grep -v grep" || echo "  - Not responding"
done
EOF

chmod +x /home/pi/health-check.sh
```

---

## 🎯 Final Checklist

### Server Pi Setup:
- [ ] Raspberry Pi 4/5 (8GB RAM) with 64GB+ microSD
- [ ] Raspberry Pi OS (64-bit) installed
- [ ] Docker and Docker Compose installed
- [ ] Node.js 18+ installed
- [ ] Application cloned and dependencies installed
- [ ] Environment variables configured with server IP
- [ ] Database started and initialized
- [ ] Application built and running with PM2
- [ ] Static IP configured
- [ ] Firewall configured
- [ ] Backup script set up
- [ ] Health check script created

### Display Pi Setup (for each display):
- [ ] Raspberry Pi Zero 2W (or Pi 4 2GB) with 16GB microSD
- [ ] Raspberry Pi OS Lite (64-bit) installed
- [ ] Chromium browser installed
- [ ] Display configuration script created
- [ ] Auto-start configured
- [ ] WiFi/Ethernet configured
- [ ] Display settings configured
- [ ] Connection to server tested

### Network Configuration:
- [ ] Server has static IP (e.g., 192.168.1.100)
- [ ] Display clients can reach server
- [ ] Firewall allows port 3000
- [ ] SSH access configured for management

### Testing:
- [ ] Server admin dashboard accessible
- [ ] All displays showing correct content
- [ ] Auto-refresh working on displays
- [ ] Management scripts functional
- [ ] Backup system working

---

## 📞 Support

For issues specific to this deployment:
1. Check the troubleshooting section above
2. Review PM2 logs: `pm2 logs real-estate-display-server`
3. Check Docker logs: `docker logs real-estate-db-1`
4. Run health check: `/home/pi/health-check.sh`
5. Check display status: `/home/pi/manage-displays.sh`

For application-specific issues, refer to the main [GitHub repository](https://github.com/mihalykrich/real-estate-display-system).

---

**🎉 Congratulations! Your Real Estate Display System is now running on Raspberry Pi with server-client architecture!**

The system will automatically start on boot with:
- **One server Pi** managing the application and database
- **Multiple display Pi clients** showing property listings
- **Centralized management** through the admin dashboard
- **Scalable architecture** for adding more displays

You can manage all displays remotely through the admin dashboard at `http://[SERVER_IP]:3000/admin`.
