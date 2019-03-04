const acorn = require('acorn');
const util = require('util');
const readFile = util.promisify(require('fs').readFile);
const argv = require('minimist')(process.argv.slice(2));

module.exports = function () {
  process.on('uncaughtException', function(err) {
    console.log(err);
    process.exit();
  })
  
  var file = argv._[0];
  if(!file) { return; }
  
  readFile(file, 'utf8')
  .then((source) => {
    var tree = acorn.parse(source);
    if(argv.tree) { return console.log(JSON.stringify(tree, null, 4)); };
  
    var injectables = require('./recursive')(tree);
  
    if(injectables && injectables.length) {
      injectables.forEach(i => console.log(i));
    }
    else {
      console.log("There were no injectables found.");
    }
  });
};