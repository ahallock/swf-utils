var expect = require('expect.js');
var activityTaskResponses = require('../activity-task-responses');

describe('activityTaskResponses', function() {
  describe('#complete', function() {
    it('returns complete object', function() {
      expect(activityTaskResponses.complete('complete result'))
        .to.eql({ RespondActivityTaskCompleted: {
          result: 'complete result' 
        }})
    });
  });

  describe('#fail', function() {
    it('returns fail object', function() {
      expect(activityTaskResponses.fail('fail details', 'fail reason'))
        .to.eql({ RespondActivityTaskFailed: {
          details: 'fail details',
          reason: 'fail reason'
        }})
    });
  });
});

