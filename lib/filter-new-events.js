var R = require('ramda');

module.exports = function(events, previousStartedEventId) {
  return R.filter(function(event) {
    return event.eventId > previousStartedEventId;
  }, events);
}
