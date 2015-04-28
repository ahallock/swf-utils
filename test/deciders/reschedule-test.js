var expect = require('expect.js');
var workflowContext = require('../../lib/context');
var events = require('../events');
var reschedule = require('../../lib/deciders/reschedule');

describe('reschedule', function() {
  it('returns schedule activity decision', function() {
    var ctx = workflowContext.create({
      events: events, previousStartedEventId: 6
    }, {
      activityTypes: {
        type2: {
          retries: 1
        } 
      }
    });

    var ctx2 = reschedule(ctx);
    expect(ctx2.decisions.length).to.be(1);
  });
});


