var R = require('ramda');
var getAttrs = require('./get-attributes');

var filterByEventTypes = function(eventTypes) {
  return R.filter(
    R.compose(R.contains(R.__, eventTypes), R.prop('eventType'))       
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
  newEvents: function(previousStartedEventId) {
    return R.filter(
      R.compose(R.gt(R.__, previousStartedEventId), R.prop('eventId'))
    )
  },
  // events that have no result yet
  // TODO: is there a simpler way?
  inProgress: function(allEvents) {
    var correlated = R.into(
      [],
      R.compose(   
        filterByEventTypes([
          'ActivityTaskFailed',
          'ActivityTaskTimedOut',
          'ActivityTaskCanceled',
          'ActivityTaskCompleted'      
        ]),
        R.map(R.compose(R.prop('scheduledEventId'), getAttrs))
      ), allEvents);

    return R.filter(
      R.converge(
        R.and,
        R.propEq('eventType', 'ActivityTaskScheduled'),
        R.compose(
          R.not,
          R.contains(R.__, correlated),
          R.prop('eventId')
        )
      )  
    , allEvents);
  }
}
