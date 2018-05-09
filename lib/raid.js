'use strict';

class Raid {
  constructor(options) {
    this.boss = options.boss;
    this.endTime = options.endTime;
    this.location = options.location;
    this.coords = options.coords;

    if (this.endTime) {
      this.hatchTime = this.endTime.clone().subtract(60, 'minutes');
    }
  }

  get channelName() {
    return `${this.boss}-${this.location}`.toLowerCase();
  }
}

module.exports = Raid;
