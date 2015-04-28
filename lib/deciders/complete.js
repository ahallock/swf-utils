var R = require('ramda');
var getAttributes = require('../get-attributes');
var responses = require('../decision-task-responses');

module.exports = function(ctx) {
  if (R.length(ctx.decisions) > 0) {
    return ctx.next([], []);
  }

  if (R.all(R.propEq('resolved', true), ctx.eventHistory.getActivities())) {
    return ctx.next([], [responses.completeWorkflow()]);
  }

  return ctx.next([], []);
}
