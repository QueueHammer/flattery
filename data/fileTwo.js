var esprima = require('esprima');
var escodegen = require('escodegen');
var fs = require('fs');
var _ = require('lodash');

function log(x) {
  console.log(JSON.stringify(x, null, 2));
}

var options = { tolerant: true };
var define = null
var req = null;

fs.readFile('./smallTest.js', 'utf8', function (err, source) {
  var tree = esprima.parse(source, options);
  log(tree);

  fs.readFile('./elements/define.js', 'utf8', function (err, defSrc) {
    define = esprima.parse(defSrc, options);
    log(define);

    fs.readFile('./elements/require.js', 'utf8', function (err, reqSrc) {
      req = esprima.parse(reqSrc, options);
      walkTree(tree);

      tree.body.unshift(define.body[1]);
      tree.body.unshift(define.body[0]);
      save(tree);
    });
  });
});

function convert(tree) {
  //Find element type: CallExpression
  //             callee: name: 'define'
  // replace elements of arguments array with requires by string
}

function walkTree(el) {
  if(!el || _.isString(el)) { return; }
  if(el.type == 'CallExpression' && el.callee && el.callee.name == 'define') {
    el.arguments[0].elements = _.map(el.arguments[0].elements, function (strLit) {
      var newReq = _.cloneDeep(req.body[0].expression);
      newReq.arguments[0] = strLit;
      return newReq;
    });
    return;
  }

  _.forEach(el, walkTree);
}

function save(tree) {
    var newScript = escodegen.generate(tree);
    fs.writeFile('./outFile.js', newScript, 'utf8');
}