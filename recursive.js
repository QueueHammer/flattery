const walk = require("acorn-walk");

module.exports = function recursiveWalk(tree) {
  var functions = {
    FunctionExpression: funkedUp,
    FunctionDeclaration: funkedUp,
    MemberExpression: expressive,
    CallExpression: expressive,
    Identifier: ender
  };
  var state = {
    keys: [],
    keyExpressions: []
  };

  walk.recursive(tree, state, functions);

  return state.keyExpressions;

  // expressions.length ?
  //   expressions.forEach(key => console.log(`${key}`)):
  //   console.log('No expressions found');;

  function funkedUp(node, state, c) {
    var newState = Object.create(state);
    newState.keys = Object.create(state.keys);

    node.params
      .filter(p => p.type == 'Identifier')
      .forEach(i => newState.keys.push(i.name));
    
    // if(newState.keys.length) {
    //   console.log(`(${newState.keys.join(', ')}) => {}`);
    // }
  
    c(node.body, newState);
  }

  function expressive(node, state, c){
    if(!state.keys.length) { return next(node, state, c); }
    var newState = Object.create(state);
    newState.currentKeys = newState.currentKeys || [];

    var newNode = null;
    var keyToPush = '';
    switch (node.type) {
      case 'CallExpression':
        newNode = node.callee;
        keyToPush = '()';
        break;
      default:
        newNode = node.object;
        keyToPush = node.property.name ?
          node.property.name: 
          `[${node.property.raw}]`;
        break;
    }
    c(newNode, newState);

    if(!state.keys.length) { return; }

    newState.currentKeys
      .push(keyToPush);

    //If we are at the top of an expression chain.
    var foundKeys = newState.currentKeys;
    if(!state.currentKeys && foundKeys.length && state.keys.includes(foundKeys[0])) {
      var newKeyExpression = newState.currentKeys.join('.');
      state.keyExpressions
        .push(newState.currentKeys.join('.').replace(/\.([\[\(])/g, '$1'));
    }

  }

  function ender(node, state, c) {
    if(!state.keys.length || !state.currentKeys) { return; }
    state.currentKeys
      .push(node.name);
  }


  function next(node, state, c) {
    walk.base[node.type](node, state, c);
  }
}
