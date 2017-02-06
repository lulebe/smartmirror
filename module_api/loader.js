const fs = require('fs')
const path = require('path')
const download = require('download')
var exec = require('child_process').exec

const $ = require('jquery')

module.exports = function (renderer, modulesList, cb) {
  modulesList.splice(0, modulesList.length)
  const modulesPath = path.normalize(path.join(__dirname, '../modules'))
  fs.access(modulesPath, fs.constants.W_OK, err => {
    if (err)
      fs.mkdir(modulesPath, err => {
        if (err)
          throw err
        else
          loadModule(renderer, modulesList, cb, 0)
      })
    else
      loadModule(renderer, modulesList, cb, 0)
  })
}

function loadModule (renderer, modulesList, cb, index) {
  const settings = renderer.getSettings()
  const modulesInfo = settings.modules
  if (index >= modulesInfo.length) {
    cb()
    return
  }
  const moduleInfo = modulesInfo[index]
  const modulePath = path.join(__dirname, '../modules', moduleInfo.name)
  fs.access(modulePath, fs.constants.W_OK, err => {
    if (err) { //module has to be downloaded
      downloadModule(moduleInfo, modulePath, modulesList, err => {
        if (err)
          console.log(err)
        loadModule(renderer, modulesList, cb, index+1)
      })
    } else { //module is already downloaded
      fs.readFile(path.join(modulePath, 'version.txt'), 'utf8', (err, versionLocal) => {
        if (err) {
          console.log(err)
          loadModule(renderer, modulesList, cb, index+1)
        } else {
          $.get(moduleInfo.versionUrl).done(versionRemote => {
            console.log(versionRemote)
            console.log(versionLocal)
            if (versionRemote.trim() == versionLocal.trim()) {
              loadModuleFromPath(modulePath, moduleInfo.data, modulesList, err => {
                if (err)
                  console.log(err)
                loadModule(renderer, modulesList, cb, index+1)
              })
            } else { //needs update
              exec('rm -r ' + modulePath, (err, stdout, stderr) => {
                if (err) {
                  console.log(err)
                  console.log(stdout)
                  console.log(stderr)
                  loadModule(renderer, modulesList, cb, index+1)
                } else {
                  downloadModule(moduleInfo, modulePath, modulesList, err => {
                    if (err)
                      console.log(err)
                    moduleInfo.version = parseInt(versionRemote)
                    renderer.setSettings(settings, false, () => {
                      loadModule(renderer, modulesList, cb, index+1)
                    })
                  })
                }
              })
            }
          }).fail((xhr, status, err) => {
            console.log(err)
            loadModule(renderer, modulesList, cb, index+1)
          })
        }
      })
    }
  })
}

function downloadModule (moduleInfo, modulePath, modulesList, cb) {
  fs.mkdir(modulePath, err => {
    if (err) {
      cb(err)
      return
    }
    download(moduleInfo.url, modulePath, {extract: true}).then(() => {
      loadModuleFromPath(modulePath, moduleInfo.data, modulesList, err => {
        if (err)
          cb(err)
        cb(null)
      })
    })
    .catch(err => {
      cb(err)
    })
  })
}

function loadModuleFromPath (modulePath, moduleData, modulesList, cb) {
  fs.readFile(path.join(modulePath, 'module.json'), (err, content) => {
    if (err) {
      cb(err)
      return
    }
    try {
      const jsPath = path.join(modulePath, 'module.js')
      delete require.cache[require.resolve(jsPath)]
      const loadedModule = {
        settings: JSON.parse(content),
        module: require(jsPath)(moduleData)
      }
      modulesList.push(loadedModule)
      //load css file if exists
      const cssPath = path.join(modulePath, 'style.css')
      fs.access(cssPath, fs.constants.W_OK, err => {
        if (!err) {
          $('head').append('<link rel="stylesheet" href="' + cssPath + '" />')
          cb(null)
          return
        }
        cb(null)
      })
    } catch (e) {
      cb(e)
    }
  })
}
