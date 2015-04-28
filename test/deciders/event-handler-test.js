var expect = require('expect.js');
var sinon = require('sinon');
var workflowContext = require('../../lib/context');
var eventHandler = require('../../lib/deciders/event-handler');
var events = require('../events');
var workflowConfig = {
  eventHandlers: {
    onWorkflowExecutionStarted: function(ctx, event) {
      return [ { myDecision: "decision content" } ];
    }
  }
};

describe('event handler', function() {
  it('calls the corresponding handler', function() {
    var spy = 
      sinon.spy(workflowConfig.eventHandlers, 'onWorkflowExecutionStarted');
    var ctx = workflowContext.create({
      events: events, previousStartedEventId: 0
    }, workflowConfig);

    eventHandler(ctx);
    expect(spy.calledOnce).to.be(true);
  });
  it('removes the events handled', function() {
    var ctx = workflowContext.create({
      events: events, previousStartedEventId: 0
    }, workflowConfig);
    var ctx2 = eventHandler(ctx);
    expect(ctx2.unhandledEvents.length).to.be(events.length - 1); 
  });
  it('adds events returned from handler', function() {
    var ctx = workflowContext.create({
      events: events, previousStartedEventId: 0
    }, workflowConfig);
    expect(eventHandler(ctx).decisions.length).to.be(1); 
  });
});



