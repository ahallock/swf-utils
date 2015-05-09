var expect = require('expect.js');
var getJsonInput = require('../get-json-input');
var R = require('ramda');

describe('get json input', function() {
  it('returns the input as JSON', function() {
    var event = {
      eventId: 1,
      eventType: 'WorkflowExecutionStarted',
      workflowExecutionStartedEventAttributes: {
        input: '{ "foo": "bar" }'
      }
    };

    var input = getJsonInput(event);
    expect(input).to.eql({
      foo: 'bar'
    });
  });
});

