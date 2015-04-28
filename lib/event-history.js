var R = require('ramda');
var getAttrs = require('./get-attributes');

var activityResolvedTypes = [
  'ActivityTaskCompleted',
  'ActivityTaskFailed',
  'ActivityTaskTimedOut',
  'ActivityTaskCanceled'
];
var scheduled = R.filter(R.propEq('eventType', 'ActivityTaskScheduled'));

function createEventIndex(events) {
  var initialIndex = R.transduce(scheduled, function(acc, value) {
    acc[value.eventId] = {
      eventType: value.eventType,
      activityId: getAttrs(value).activityId
    }
    return acc; 
  }, {}, events); 

  var resolved = R.filter(
    R.compose(R.contains(R.__, activityResolvedTypes), R.prop('eventType'))
  );

  return R.transduce(resolved, function(acc, value) {
    var scheduledEventId = getAttrs(value).scheduledEventId;
    acc[value.eventId] = {
      eventType: value.eventType,
      activityId: acc[scheduledEventId].activityId
    }
    return acc;
  }, initialIndex, events);
}

function createActivityInfoIndex(events, eventsIndex) {
  var activities = R.transduce(scheduled, function(acc, value) {
    var attrs = getAttrs(value);
    acc[attrs.activityId] = attrs;
    return acc;
  }, {}, events); 

  // create info objects
  return R.mapObj(function(activity) {
    var correlatedEvents = R.filter(
      R.propEq('activityId', activity.activityId)
    , R.values(eventsIndex));

    var counts = R.countBy(R.prop('eventType'), correlatedEvents);
    return {
      attempts: counts['ActivityTaskScheduled'],
      activityType: activity.activityType,
      complete: R.has('ActivityTaskCompleted', counts),
      resolved: R.any(
        R.contains(R.__, activityResolvedTypes)
      , R.keys(counts)),
      attrs: activity
    }
  }, activities);
}

module.exports = function(events) {
  var eventsIndex = createEventIndex(events);
  var activityIndex = createActivityInfoIndex(events, eventsIndex);
  var workflowEventStartedAttrs =
    getAttrs(R.find(R.propEq('eventType', 'WorkflowExecutionStarted'), events));

  return {
    getWorkflowInput: function() {
      return workflowEventStartedAttrs.input;
    },
    getActivities: function() {
      return R.values(activityIndex)
    },
    getActivityInfo: function(event) {
      var activityId = eventsIndex[event.eventId].activityId;
      return activityIndex[activityId]; 
    } 
  }
}
