var expect = require('expect.js');
var filterNew = require('../lib/filter-new-events');

describe('filter-new', function() {
  it('returns new events', function() {
    var previousStartedEventId = 1;
    var events = [ { eventId: 1 }, { eventId: 2 } ];
    expect(filterNew(events, previousStartedEventId)).to.eql([
      { eventId: 2 }
    ]);
  });
});

