var expect = require('expect.js');
var difference = require('../lib/difference');

describe('difference', function() {
  it('returns the difference between event lists', function() {
    var eventsA = [ { eventId: 1 }, { eventId: 2 }, { eventId: 3 } ];
    var eventsB = [ { eventId: 2 } ];
   
    expect(difference(eventsA, eventsB)).to.eql([
      { eventId: 1 },
      { eventId: 3 }
    ]);
  });
});
