gpio -g mode 4 up
gpio -g export 4 in
gpio -g mode 17 up
gpio -g export 17 in
gpio -g mode 27 up
gpio -g export 27 in
gpio -g mode 22 up
gpio -g export 22 in
gpio -g mode 23 up
gpio -g export 23 in
cd /home/pi/smartmirror
npm start
