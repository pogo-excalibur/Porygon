'use strict';

class Egg {
  constructor(options) {
    this.level = options.level;
    this.hatchTime = options.hatchTime;
    this.location = options.location;
    this.coords = options.coords;

    if (this.hatchTime) {
      this.endTime = this.hatchTime.clone().add(45, 'minutes');
    }
  }

  get channelName() {
    return `lvl-${this.level}-egg-${this.location}`.toLowerCase();
  }
}

module.exports = Egg;
