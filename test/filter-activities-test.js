var expect = require('expect.js');
var filterActivities = require('../filter-activities');
var R = require('ramda');

var activities = [
  {
    activityType: { name: 'activityType1', version: '1' }
  },
  {
    activityType: { name: 'activityType2', version: '1' }
  }
];

describe('filter activities', function() {
  it('returns activites by type', function() {
    var type1 = filterActivities.byType('activityType1')(activities);
    expect(type1).to.eql([ { activityType: { name: 'activityType1', version: '1' } } ]);
  })
});



