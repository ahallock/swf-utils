var R = require('ramda');
var attrs = require('./get-attributes');
var compose = R.compose;
var filter = R.filter;

var filterByEventTypes = function(eventTypes) {
  return filter(
    compose(R.contains(R.__, eventTypes), R.prop('eventType'))
  );
};

module.exports = {
  failedActivities: filterByEventTypes([
    'ActivityTaskFailed',
    'ActivityTaskTimedOut'
  ]),
  completedActivities: filterByEventTypes([
    'ActivityTaskCompleted'
  ]),
  workflowExecutionStarted: filterByEventTypes([
    'WorkflowExecutionStarted'    
  ]),
  newEvents: function(prevEventId) {
    return filter(compose(R.gt(R.__, prevEventId), R.prop('eventId')))
  },
  // events that have no result yet
  // TODO: is there a simpler way?
  inProgress: function(allEvents) {
    var correlated = R.into(
      [],
      compose(
        filterByEventTypes([
          'ActivityTaskFailed',
          'ActivityTaskTimedOut',
          'ActivityTaskCanceled',
          'ActivityTaskCompleted'      
        ]),
        R.map(compose(R.prop('scheduledEventId'), attrs))
      ), allEvents);

    return filter(
      R.converge(
        R.and,
        R.propEq('eventType', 'ActivityTaskScheduled'),
        compose(
          R.not,
          R.contains(R.__, correlated),
          R.prop('eventId')
        )
      )  
    , allEvents);
  }
}
