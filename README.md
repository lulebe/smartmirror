# Smartmirror

## Requirements

Computer with internet connection and up to date node(>= v6 LTS)/npm installed.

## Installation

1. on mac `sh mac_install.sh`, on raspi/ubuntu/debian (needs apt-get) `sh raspi_install.sh`
2. `npm start`

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
    npm install
    npm start
