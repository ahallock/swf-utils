var R = require('ramda');

// helper to download all history events
function pollForDecisionTask(params, events, swfPoll) {
  return swfPoll(params)
    .then(function(res) {
      if (res.nextPageToken) {
        return pollForDecisionTask(
          R.merge(params, { nextPageToken: res.nextPageToken }),
          events.concat(res.events),
          swfPoll
        );
      }
      return R.merge(res, { events: events.concat(res.events) });
    });
}

module.exports = pollForDecisionTask;
