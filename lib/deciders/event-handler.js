var R = require('ramda');
var capitalize = require('underscore.string/capitalize');

module.exports = function(ctx) {
  var result = R.reduce(function(acc, val) {
    var decision = [];
    // e.g.: onWorkflowExecutionStarted
    var eventHandlers = 
      ctx.workflowConfig.eventHandlers;
    var eventHandler;
    if (eventHandlers
      && (eventHandler = eventHandlers['on'+ capitalize(val.eventType)])) {
      acc.events.push(val);
      var decisions = eventHandler(ctx, val);
      if (decisions) {
        acc.decisions = R.concat(acc.decisions, decisions); 
      }
    }
    return acc;
  }, { events: [], decisions: [] }, ctx.unhandledEvents);
  return ctx.next(result.events, result.decisions);
}
