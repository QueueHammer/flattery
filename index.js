const acorn = require('acorn');

module.exports = function injectables(sourceCode) {
  var tree = acorn.parse(sourceCode);
  return require('./recursive')(tree);
}