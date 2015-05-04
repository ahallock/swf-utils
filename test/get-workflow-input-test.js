var expect = require('expect.js');
var getWorkflowInput = require('../lib/get-workflow-input');
var R = require('ramda');

describe('get workflow input', function() {
  it('returns the input', function() {
    var events = [
      {
        eventId: 1,
        eventType: 'WorkflowExecutionStarted',
        workflowExecutionStartedEventAttributes: {
          input: 'foo bar'
        }
      },
      {
        eventId: 2,
        eventType: 'ActivityTaskScheduled'
      }
    ];

    var input = getWorkflowInput(events);
    expect(input).to.be('foo bar');
  });
});



