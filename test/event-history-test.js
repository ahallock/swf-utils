var expect = require('expect.js');
var eventHistory = require('../lib/event-history');
var events = require('./events');
var history = eventHistory(events);

describe('event history', function() {
  it('finds activity info correlated with an event', function() {
    var info = history.getActivityInfo(events[1]);
    expect(info.attempts).to.be(2);
    expect(info.complete).to.be(true);
    expect(info.resolved).to.be(true);
    expect(info.attrs).to.eql({ activityId: 'activity1', activityType: 'type1' });
  });
  it('returns the workflow execution input', function() {
    expect(history.getWorkflowInput()).to.be('workflow input');  
  });
  it('returns activities', function() {
    expect(history.getActivities()).to.eql([
      { attempts: 2,
        activityType: 'type1',
        complete: true,
        resolved: true,
        attrs: { activityId: 'activity1', activityType: 'type1' } },
      { attempts: 1,
        activityType: 'type2',
        complete: false,
        resolved: true,
        attrs: { activityId: 'activity2', activityType: 'type2' } }  
    ]);
  });
});
