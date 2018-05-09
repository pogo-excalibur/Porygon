'use strict';

const RaidChannelManager = require('./raid-channel-manager');

class Guild {
  constructor(discordGuild, options) {
    this.discordGuild = discordGuild;

    this.options = this._defaultOptions();
    Object.assign(this.options, options);

    this.raidChannels = this.options.raidChannels;
    this.knownRaids = this.options.knownRaids;
  }

  get id() {
    return this.discordGuild.id;
  }

  setup() {
    return new Promise((resolve, reject) => {
      this.raidCreateChannels = [];
      this.options.raidCreateChannelIds.forEach(channelId => {
        let channel = this.discordGuild.channels.get(channelId);
        if (channel) {
          this.raidCreateChannels.push(channel);
        } else {
          console.error(`Could not access channel ${channelId}.`);
        }
      });

      this.raidInfoChannels = [];
      this.options.raidInfoChannelIds.forEach(channelId => {
        let channel = this.discordGuild.channels.get(channelId);
        if (channel) {
          this.raidInfoChannels.push(channel);
        } else {
          console.error(`Could not access channel ${channelId}.`);
        }
      });

      if ((this.raidCreateChannels.length +
           this.raidInfoChannels.length) === 0) {
        reject(`Failed to setup guild ${this.discordGuild.name}: ` +
               'No accessible input channels.');
      }

      if (this.options.raidCategoryId) {
        this.raidCategory = this.discordGuild.channels.get(
          this.options.raidCategoryId);
        if (!this.raidCategory) {
          console.error(`Could not access channel ${this.options.raidCategoryId}.`);
        }
      }

      resolve(this);
    });
  }

  _defaultOptions() {
    return {
      enabled: false,
      raidCreateChannelIds: [],
      raidInfoChannelIds: [],
      raidCategoryId: undefined,
      raidChannels: new RaidChannelManager(),
      knownRaids: {}
    };
  }
}

module.exports = Guild;
