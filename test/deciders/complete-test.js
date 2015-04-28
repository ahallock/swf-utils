var expect = require('expect.js');
var complete = require('../../lib/deciders/complete');
var workflowContext = require('../../lib/context');

var events = [
  {
    eventId: 1,
    eventType: 'ActivityTaskCompleted',
    activityTaskCompletedEventAttributes: {
      result: 'result',
      scheduledEventId: 2
    }
  },  
  {
    eventId: 2,
    eventType: 'ActivityTaskScheduled',
    activityTaskScheduledEventAttributes: {
      activityId: 'activity1',
      activityType: 'type1'
    }
  },  
  {
    eventId: 1,
    eventType: 'WorkflowExecutionStarted',
    workflowExecutionStartedEventAttributes: {
      input: 'workflow input'
    }
  }  
];

describe('complete workflow', function() {
  context('when all activities resolved', function() {
    it('returns workflow complete decision', function() {
      var ctx = workflowContext.create({
        events: events, previousStartedEventId: 0
      }, {});

      var ctx2 = complete(ctx);
      expect(ctx2.decisions).to.eql([
        {
          decisionType: 'CompleteWorkflowExecution',
          completeWorkflowExecutionDecisionAttributes: {}
        }
      ]);
    }); 
  });
  context('when pending tasks', function() {
    it('returns empty array', function() {
      var ctx = workflowContext.create({
        events: [events[1], events[2]], previousStartedEventId: 0
      }, {});
      var ctx2 = complete(ctx);
      expect(ctx2.decisions).to.eql([]);
    });
  });
});


