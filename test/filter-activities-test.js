var expect = require('expect.js');
var filterActivities = require('../lib/filter-activities');
var R = require('ramda');

var activities = [
  {
    activityType: 'activityType1'
  },
  {
    activityType: 'activityType2'
  }
];

describe('filter activities', function() {
  it('returns activites by type', function() {
    var type1 = filterActivities.byType('activityType1', activities);
    expect(type1).to.eql([ { activityType: 'activityType1' } ]);
  })
});



