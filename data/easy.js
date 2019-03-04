module.exports = function (first, second, third) {
  first.propOne.propThree = 5;
  second.propOne().propTwo.propThree()
  third.propOne[5].propTwo().propThree == 'fish';
  window.notReal(first.propOne.propTwo().propThree);
}