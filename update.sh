git fetch --all
git reset --hard origin/master
export npm_config_target=1.4.15
export npm_config_disturl=https://atom.io/download/electron
export npm_config_runtime=electron
export npm_config_build_from_source=true
HOME=.electron-gyp npm install
export npm_config_build_from_source=false
rm -rf .electron-gyp
reboot
