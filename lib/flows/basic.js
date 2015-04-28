var R = require('ramda');
var reschedule = require('../deciders/reschedule');
var eventHandler = require('../deciders/event-handler');
var complete = require('../deciders/complete');
var workflowContext = require('../context');

module.exports = function(decisionTask, workflowConfig) {
  var ctx = workflowContext.create(decisionTask, workflowConfig);
  var flow = R.compose(complete, eventHandler, reschedule);
  return flow(ctx).decisions;
}
