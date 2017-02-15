# Smartmirror

## Requirements

Computer with internet connection and up to date node(>= v6 LTS)/npm installed.

## Installation

0. setup wifi (install networkmonitor, edit a file)
1. setup gpio, in autostart "gpio export 4 in" for 4,17,27,23,22
2. on mac `sh mac_install.sh`, on raspi/ubuntu/debian (needs apt-get) `sh raspi_install.sh`
3. `npm start`

## Functionality

1. Displays modules on screen
2. Bonjour service discovery for finding the Mirror on the local network
3. HTTP Server to change settings from another device (eg smartphone)
4. connect to wifi networks via mirror app

## Update script
    cd ~
    rm -rf smartmirror
    git clone https://github.com/lulebe/smartmirror.git
    cd smartmirror
    sh mac_install.sh|raspi_install.sh
