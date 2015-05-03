var R = require('ramda');

module.exports = {
  complete: R.pipe(
    R.createMapEntry('result'),
    R.createMapEntry('RespondActivityTaskCompleted')
  ),
  fail: R.compose(
    R.createMapEntry('RespondActivityTaskFailed'),
    R.useWith(
      R.merge,
      R.createMapEntry('details'),
      R.createMapEntry('reason')
    )
  )
};
