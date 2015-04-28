var expect = require('expect.js');
var basicFlow = require('../../lib/flows/basic');
var events = require('../events');
var responses = require('../../lib/decision-task-responses');

describe('basic flow', function() {
  it('returns decisions', function() {
    var decisions = basicFlow({
      events: events, previousStartedEventId: 5
    }, {
      eventHandlers: {
        onActivityTaskCompleted: function(ctx, event) {
          return [responses.scheduleActivityTask({
            foo: 'bar'
          })];
        }   
      },
      activityTypes: {
        type2: {
          retries: 1
        }
      }
    }); 

    expect(decisions).to.eql([ { decisionType: 'ScheduleActivityTask',
      scheduleActivityTaskDecisionAttributes:
        { activityId: 'activity2', activityType: 'type2' } },
      { decisionType: 'ScheduleActivityTask',
       scheduleActivityTaskDecisionAttributes: { foo: 'bar' } } ]
    );
  });
});
