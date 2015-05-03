var R = require('ramda');

module.exports = {
  byType: R.useWith(R.filter, R.propEq('activityType'), R.identity)
}
