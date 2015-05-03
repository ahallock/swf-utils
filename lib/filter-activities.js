var R = require('ramda');

module.exports = {
  byType: function(type) {
    return R.filter(function(activity) {
      return activity.activityType.name === type;
    });
  }
}
