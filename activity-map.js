var R = require('ramda');
var getAttrs = require('./get-attributes');
var S = require('underscore.string.fp');

function createIndexes(events) {
  return R.reduce(function(acc, value) {
    if (!S.startsWith('Activity')(value.eventType)) return acc;
    var attrs = getAttrs(value);
    var activityId = value.eventType === 'ActivityTaskScheduled' ?
      attrs.activityId : acc.events[attrs.scheduledEventId];
    acc.events[value.eventId] = activityId; 
    var obj = acc.activities[activityId] ||
      (acc.activities[activityId] = { 
        attrs: attrs,
        activityId: activityId,
        activityType: attrs.activityType
      });
    var eventTypeKey = value.eventType.replace('ActivityTask','').toLowerCase();
    if (!R.has(eventTypeKey, obj)) obj[eventTypeKey] = 0;
    obj[eventTypeKey]++;
    return acc;
  }, { activities: {}, events: {} }, events);
}

module.exports = function(events) {
  var indexes = createIndexes(events);
  return function(eventId) {
    return indexes.activities[indexes.events[eventId]];
  }
}
