var R = require('ramda');
var responses = require('../decision-task-responses');

var failedEvents = [
  'ActivityTaskFailed',
  'ActivityTaskTimedOut'
];

module.exports = function(ctx) {
  var failed = R.filter(function(event) {
    return R.contains(event.eventType, failedEvents);
  }, ctx.unhandledEvents);

  var retryable = R.filter(function(event) {
    var info = ctx.eventHistory.getActivityInfo(event);
    var retries = ctx.workflowConfig.activityTypes[info.activityType].retries;
    return info.attempts <= retries;
  }, failed);

  var decisions = R.map(function(event) {
    var attrs = ctx.eventHistory.getActivityInfo(event).attrs;
    return responses.scheduleActivityTask(attrs); 
  }, retryable);

  return ctx.next(retryable, decisions);  
}
