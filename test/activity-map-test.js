var expect = require('expect.js');
var createActivityMap = require('../lib/activity-map');
var events = require('./events');
var activityMap = createActivityMap(events);

describe('activity map', function() {
  it('finds activity info correlated with an event', function() {
    var info = activityMap(events[2]);
    expect(info.attempts).to.be(2);
    expect(info.activityType).to.be('type1');
    expect(info.activityId).to.be('activity1');
    expect(info.attrs).to.eql({ activityId: 'activity1', activityType: 'type1' });
  });
});

