'use strict';

const moment = require('moment');
require('moment-timezone');

const tzlookup = require('tz-lookup');

/**
 * Provides a wrapper around `moment` with support for
 * position-based timezone offsets.
 */
class Time {
  constructor(...args) {
    this.moment = moment(...args);
  }

  setTimezone(timezone) {
    this.moment = this.moment.tz(timezone);
    return this;
  }

  setLocation(location) {
    const timezone = tzlookup(...location);
    this.setTimezone(timezone);
    return this;
  }

  format(...args) {
    return this.moment.format(...args);
  }

  clone() {
    const dup = new Time();
    dup.moment = this.moment.clone();
    return dup;
  }
}

module.exports = Time;
