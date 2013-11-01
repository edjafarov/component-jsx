var reactTools = require('react-tools');
var path = require('path');
var fs = require('fs');

module.exports = function(builder) {
  builder.hook('before scripts', function(pkg, next) {

    // No scripts field in the component.json file
    if (pkg.config.scripts === undefined) return next();

    // Get all the coffee files from the scripts list
    var jsx = pkg.config.scripts.filter(function(file){
      return path.extname(file) === '.js';
    });

    // No scripts
    if( jsx.length === 0 ) return next();
    jsx.forEach(function(file, i){
      var realpath = pkg.path(file);
      var str = fs.readFileSync(realpath, 'utf8');
      var compiled = reactTools.transform(str);
      
      pkg.removeFile('scripts', file);
      pkg.addFile('scripts', file, compiled);
    });
    next();
  });
};

