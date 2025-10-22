#!/bin/bash

# Dual Display Setup Script for Raspberry Pi 4
# This script configures two displays on a single Pi 4

echo "=========================================="
echo "Raspberry Pi 4 Dual Display Setup"
echo "=========================================="

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "Installing required packages..."
sudo apt install -y chromium-browser unclutter xdotool

# Configure display settings
echo "Configuring dual display setup..."

# Create display configuration
sudo tee /boot/config.txt > /dev/null <<EOF
# Dual Display Configuration
# Enable both HDMI ports
hdmi_force_hotplug=1
hdmi_drive=2

# Display 1 (Primary) - HDMI0
hdmi_group=2
hdmi_mode=82
hdmi_cvt=1920 1080 60 6 0 0 0

# Display 2 (Secondary) - HDMI1  
hdmi_group=2
hdmi_mode=82
hdmi_cvt=1920 1080 60 6 0 0 0

# Enable dual display
display_rotate=0
dtoverlay=vc4-kms-v3d
max_framebuffers=2

# Disable overscan
disable_overscan=1

# GPU memory split
gpu_mem=128
EOF

# Create X11 configuration for dual displays
sudo tee /etc/X11/xorg.conf.d/99-dual-display.conf > /dev/null <<EOF
Section "ServerLayout"
    Identifier "DualDisplay"
    Screen 0 "Display1" 0 0
    Screen 1 "Display2" RightOf "Display1"
EndSection

Section "Monitor"
    Identifier "Monitor1"
    Option "Primary" "true"
EndSection

Section "Monitor"
    Identifier "Monitor2"
EndSection

Section "Device"
    Identifier "Card1"
    Driver "modesetting"
    BusID "PCI:0:0:0"
    Screen 0
EndSection

Section "Device"
    Identifier "Card2"
    Driver "modesetting"
    BusID "PCI:0:0:0"
    Screen 1
EndSection

Section "Screen"
    Identifier "Display1"
    Device "Card1"
    Monitor "Monitor1"
    DefaultDepth 24
    SubSection "Display"
        Depth 24
        Modes "1920x1080"
    EndSubSection
EndSection

Section "Screen"
    Identifier "Display2"
    Device "Card2"
    Monitor "Monitor2"
    DefaultDepth 24
    SubSection "Display"
        Depth 24
        Modes "1920x1080"
    EndSubSection
EndSection
EOF

# Create startup script for dual displays
sudo tee /home/pi/start-dual-displays.sh > /dev/null <<EOF
#!/bin/bash

# Dual Display Startup Script
echo "Starting dual display setup..."

# Wait for displays to initialize
sleep 10

# Get display information
DISPLAY1=\$(xrandr --query | grep "HDMI-1 connected" | awk '{print \$1}')
DISPLAY2=\$(xrandr --query | grep "HDMI-2 connected" | awk '{print \$1}')

if [ -n "\$DISPLAY1" ] && [ -n "\$DISPLAY2" ]; then
    echo "Both displays detected: \$DISPLAY1 and \$DISPLAY2"
    
    # Configure dual display layout
    xrandr --output \$DISPLAY1 --mode 1920x1080 --primary
    xrandr --output \$DISPLAY2 --mode 1920x1080 --right-of \$DISPLAY1
    
    # Start Display 1 (Left monitor)
    DISPLAY=:0.0 chromium-browser \\
        --kiosk \\
        --no-sandbox \\
        --disable-dev-shm-usage \\
        --disable-gpu \\
        --disable-web-security \\
        --disable-features=VizDisplayCompositor \\
        --window-position=0,0 \\
        --window-size=1920,1080 \\
        http://YOUR_SERVER_IP:3000/display/1 &
    
    # Start Display 2 (Right monitor)  
    DISPLAY=:0.1 chromium-browser \\
        --kiosk \\
        --no-sandbox \\
        --disable-dev-shm-usage \\
        --disable-gpu \\
        --disable-web-security \\
        --disable-features=VizDisplayCompositor \\
        --window-position=1920,0 \\
        --window-size=1920,1080 \\
        http://YOUR_SERVER_IP:3000/display/2 &
        
    echo "Dual displays started successfully!"
else
    echo "Error: Could not detect both displays"
    echo "Available displays:"
    xrandr --query | grep "connected"
fi
EOF

# Make script executable
sudo chmod +x /home/pi/start-dual-displays.sh

# Create systemd service for auto-start
sudo tee /etc/systemd/system/dual-displays.service > /dev/null <<EOF
[Unit]
Description=Dual Display Kiosk
After=graphical.target

[Service]
Type=simple
User=pi
ExecStart=/home/pi/start-dual-displays.sh
Restart=always
RestartSec=10

[Install]
WantedBy=graphical.target
EOF

# Enable the service
sudo systemctl enable dual-displays.service

echo "=========================================="
echo "Dual Display Setup Complete!"
echo "=========================================="
echo ""
echo "Configuration Summary:"
echo "- Display 1 (Left): Shows /display/1"
echo "- Display 2 (Right): Shows /display/2"
echo "- Auto-starts on boot"
echo "- Kiosk mode enabled"
echo ""
echo "Next Steps:"
echo "1. Replace 'YOUR_SERVER_IP' in the script with your actual server IP"
echo "2. Reboot the Pi: sudo reboot"
echo "3. Both displays should start automatically"
echo ""
echo "Manual start: sudo systemctl start dual-displays"
echo "Check status: sudo systemctl status dual-displays"
echo "View logs: journalctl -u dual-displays -f"
