var R = require('ramda');
var difference = require('./difference');
var filterNew = require('./filter-new-events');
var eventHistory = require('./event-history');

function Context(workflowConfig, eventHistory, unhandledEvents, decisions) {
  this.workflowConfig = workflowConfig;
  this.eventHistory = eventHistory;
  this.unhandledEvents = unhandledEvents;
  this.decisions = decisions;
}

Context.prototype.next = function(handledEvents, newDecisions) {
  return new Context(
    this.workflowConfig,
    this.eventHistory,
    difference(this.unhandledEvents, handledEvents),
    R.concat(this.decisions, newDecisions)
  );   
}

module.exports = {
  create: function(decisionTask, workflowConfig) {
    var history = eventHistory(decisionTask.events);
    var newEvents = filterNew(
      decisionTask.events, decisionTask.previousStartedEventId    
    )
    return new Context(workflowConfig, history, newEvents, []);
  }
}
