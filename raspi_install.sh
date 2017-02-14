sudo apt-get install libmagic-dev libatlas-base-dev sox libsox-fmt-all
rm -rf node_modules
export npm_config_target=1.4.15
export npm_config_disturl=https://atom.io/download/electron
export npm_config_runtime=electron
export npm_config_build_from_source=true
HOME=.electron-gyp npm install
export npm_config_build_from_source=false
npm rm electron
npm install electron
rm -rf .electron-gyp
mkdir modules
mkdir data
unset npm_config_target
unset npm_config_disturl
unset npm_config_runtime
unset npm_config_build_from_source
