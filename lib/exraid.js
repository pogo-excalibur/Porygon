'use strict';

const Raid = require('./raid');

class ExRaid extends Raid {
  constructor() {
    super();
    this.boss = 'Mewtwo';
  }

  get channelName() {
    return 'ex-' + super.channelName();
  }
}

module.exports = ExRaid;
