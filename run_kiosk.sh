#!/bin/bash
export DISPLAY=":0.0"

# Kill all existing instances of the browser
pkill -o chromium



xset s noblank
xset s off
xset -dpms

unclutter -idle 0.5 -root &

sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/pi/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/pi/.config/chromium/Default/Preferences




# Launch the browser in full screen Kiosk mode 
sudo -u pi /usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk  https://kehilaton.boost-pop.com/tv-display/1/?key=Erx0R4dz92w982glfu46 &


echo "waiting for the process to start"


# Wait for the process to start
while pgrep -u $UID -x /usr/bin/chromium-browser > /dev/null; do sleep 1; done


echo "done running kisk script"
