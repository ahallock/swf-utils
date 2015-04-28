var R = require('ramda');

module.exports = function(eventsA, eventsB) {
  return R.reject(
    R.isNil, R.differenceWith(R.eqProps('eventId'), eventsA, eventsB)
  );
}

