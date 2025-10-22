#!/bin/bash

# Alternative: Single Browser Window Spanning Both Displays
# This approach uses one browser window across both monitors

echo "=========================================="
echo "Raspberry Pi 4 Dual Display (Single Window)"
echo "=========================================="

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "Installing required packages..."
sudo apt install -y chromium-browser unclutter xdotool

# Configure display settings for extended desktop
sudo tee /boot/config.txt > /dev/null <<EOF
# Dual Display Configuration - Extended Desktop
hdmi_force_hotplug=1
hdmi_drive=2
hdmi_group=2
hdmi_mode=82
hdmi_cvt=3840 1080 60 6 0 0 0
disable_overscan=1
gpu_mem=128
EOF

# Create startup script for extended desktop
sudo tee /home/pi/start-extended-display.sh > /dev/null <<EOF
#!/bin/bash

echo "Starting extended display setup..."

# Wait for displays to initialize
sleep 10

# Configure extended desktop (3840x1080 = 2x 1920x1080)
xrandr --output HDMI-1 --mode 1920x1080 --pos 0x0
xrandr --output HDMI-2 --mode 1920x1080 --pos 1920x0

# Create custom HTML page for dual display
cat > /home/pi/dual-display.html <<'HTML'
<!DOCTYPE html>
<html>
<head>
    <title>Dual Display</title>
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        .display-container { 
            width: 1920px; 
            height: 1080px; 
            float: left; 
            border: none;
        }
        .display-left { background: #f0f0f0; }
        .display-right { background: #e0e0e0; }
    </style>
</head>
<body>
    <iframe class="display-container display-left" 
            src="http://YOUR_SERVER_IP:3000/display/1"></iframe>
    <iframe class="display-container display-right" 
            src="http://YOUR_SERVER_IP:3000/display/2"></iframe>
</body>
</html>
HTML

# Start browser in kiosk mode spanning both displays
chromium-browser \\
    --kiosk \\
    --no-sandbox \\
    --disable-dev-shm-usage \\
    --disable-gpu \\
    --disable-web-security \\
    --window-position=0,0 \\
    --window-size=3840,1080 \\
    file:///home/pi/dual-display.html &

echo "Extended display started successfully!"
EOF

# Make script executable
sudo chmod +x /home/pi/start-extended-display.sh

# Create systemd service
sudo tee /etc/systemd/system/extended-display.service > /dev/null <<EOF
[Unit]
Description=Extended Display Kiosk
After=graphical.target

[Service]
Type=simple
User=pi
ExecStart=/home/pi/start-extended-display.sh
Restart=always
RestartSec=10

[Install]
WantedBy=graphical.target
EOF

# Enable the service
sudo systemctl enable extended-display.service

echo "=========================================="
echo "Extended Display Setup Complete!"
echo "=========================================="
echo ""
echo "Configuration Summary:"
echo "- Single browser window spanning both displays"
echo "- Left half: Shows /display/1"
echo "- Right half: Shows /display/2"
echo "- Total resolution: 3840x1080"
echo ""
echo "Next Steps:"
echo "1. Replace 'YOUR_SERVER_IP' in the HTML file with your actual server IP"
echo "2. Reboot the Pi: sudo reboot"
echo "3. Both displays should show as one extended desktop"
