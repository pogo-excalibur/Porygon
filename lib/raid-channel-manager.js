'use strict';

class RaidChannelManager {
  constructor(updateFrequencyMs = 60000) {
    this.channels = {};

    setInterval(() => {
      this._processChannelEvents();
    }, updateFrequencyMs);
  }

  add(channel) {
    if (channel.hasEnded()) return;
    this.channels[channel.id] = channel;
  }

  _processChannelEvents() {
    for (let channelId in this.channels) {
      const channel = this.channels[channelId];
      if (channel.hasEnded()) {
        this._processRaidEnd(channel);
      } else if (channel.hasHatched()) {
        this._processEggHatch(channel);
      }
    }
  }

  _processEggHatch(channel) {
    
  }

  _processRaidEnd(channel) {
    console.log('Raid ended');
  }
}

module.exports = RaidChannelManager;
