var expect = require('expect.js');
var createActivityMap = require('../activity-map');
var events = require('./events');
var activityMap = createActivityMap(events);

describe('activity map', function() {
  it('finds activity info correlated with an event', function() {
    var info = activityMap(events[2].eventId);
    expect(info.scheduled).to.be(2);
    expect(info.activityType).to.eql({ name: 'type1', version: '1' });
    expect(info.activityId).to.be('activity1');
    expect(info.attrs)
      .to.eql({ activityId: 'activity1',
        activityType: { name: 'type1', version: '1' } });
  });
});

