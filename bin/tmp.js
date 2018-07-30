var fs = require('fs') 
var _ = require('lodash')
var path = require('path')

var modules = fs.readdirSync(path.join(__dirname, 'modules'))

_.each(modules, function(module) { 
  var files = fs.readdirSync(path.join(__dirname, 'modules', module))
  _.each(files, function(file) {
    var new_name = file[0].toUpperCase() + file.substring(1, file.length)
    var p = path.join(__dirname, 'modules', module, file)
    var new_p = path.join(__dirname, 'modules', module, new_name)
    fs.rename(p, new_p, function(err) {
      if (err) { console.log(err) }
    })
  })
})


