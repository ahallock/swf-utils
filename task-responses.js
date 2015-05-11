var R = require('ramda');

function ActivityTaskCompleted(result) {
  this.result = result;
}

function ActivityTaskCanceled(details) {
  this.details = details;
}

function ActivityTaskFailed(details, reason) {
  this.details = details;
  this.reason = reason;
}

function DecisionTaskCompleted(decisions, executionContext) {
  this.decisions = decisions;
  this.executionContext = executionContext;
}

module.exports = {
  ActivityTaskCompleted: ActivityTaskCompleted,
  ActivityTaskCanceled: ActivityTaskCanceled,
  ActivityTaskFailed: ActivityTaskFailed,
  DecisionTaskCompleted: DecisionTaskCompleted
}
