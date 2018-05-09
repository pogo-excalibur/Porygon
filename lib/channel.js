'use strict';

const Egg = require('./egg');
const Raid = require('./raid');
const ExRaid = require('./exraid');
const Time = require('./time');
const Utils = require('./utils');

class Channel {
  constructor(guild, raidEntity, creator) {
    this.guild = guild;
    this.raidEntity = raidEntity;
    this.creator = creator;
    this.name = this.raidEntity.channelName
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^0-9a-z-]/g, '');
  }

  get id() {
    return this.raidEntity.location.toLowerCase();
  }

  createDiscordChannel() {
    const options = {};

    if (this.guild.raidCategory) {
      options.parent = this.guild.raidCategory.id;
    }

    return this.guild.discordGuild.channels.create(this.name, options)
      .then(discordChannel => {
        this.discordChannel = discordChannel;
        return this._setup();
      })
      .then(() => {
        return this;
      });
  }

  currentTime() {
    const now = new Time();
    now.setLocation(this.raidEntity.location);
    return now;
  }

  hasHatched() {
    const timeAtLocation = new Time();
    return timeAtLocation.moment >= this.raidEntity.hatchTime;
  }

  hasEnded() {
    const timeAtLocation = new Time();
    return timeAtLocation.moment >= this.raidEntity.endTime;
  }

  /* eslint-disable quotes */
  _setup() {
    const message = this._buildMessage();
    const embed = this._buildEmbed();
    return this.discordChannel.send(message)
      .then(this.discordChannel.send(embed));
  }

  _buildMessage() {
    if (this.raidEntity instanceof ExRaid) {
      // return this._buildExRaidMessage(); ToDo
    } else if (this.raidEntity instanceof Raid) {
      return this._buildRaidMessage();
    } else if (this.raidEntity instanceof Egg) {
      return this._buildEggMessage();
    }
  }

  _buildEggMessage() {
    const raidEntity = this.raidEntity;
    const level = raidEntity.level;
    const gym = raidEntity.location;

    var message = `<@${this.creator.id}> has spotted a level ` +
                  `${level} raid at ${gym}.\n\n`;

    if (raidEntity.hatchTime) {
      const hatchTime = raidEntity.hatchTime.format('HH:mm');
      message += `The egg will hatch at ${hatchTime}.`;
    } else {
      message += `The egg's hatch time hasn't been set yet. ` +
                 `You can set the hatch time using ##TODO##.`;
    }

    return message;
  }

  _buildRaidMessage() {
    const boss = this.raidEntity.boss;
    const bossData = Utils.pokemonData(boss);
    const gym = this.raidEntity.location;

    var message = `<@${this.creator.id}> has spotted ` +
                  `${bossData.article} ${boss} raid at ${gym}.\n\n`;

    if (this.raidEntity.endTime) {
      const endTime = this.raidEntity.endTime.format('HH:mm');
      message += `The raid will end at ${endTime}.`;
    } else {
      message += `The raid's end time hasn't been set yet. ` +
                 `You can set the end time using ##TODO##.`;
    }

    return message;
  }

  _buildEmbed() {
    if (this.raidEntity instanceof ExRaid) {
      // return this._buildExRaidEmbed(); ToDo
    } else if (this.raidEntity instanceof Raid) {
      return this._buildRaidEmbed();
    } else if (this.raidEntity instanceof Egg) {
      return this._buildEggEmbed();
    }
  }

  _buildEggEmbed() {
    const raidEntity = this.raidEntity;
    const level = raidEntity.level;
    const levelInfo = Utils.raidLevelData(level);
    const gym = raidEntity.location;
    const coords = this.raidEntity.coords;
    const urlLink = this._mapLink(coords || gym, coords);

    return {
      embed: {
        title: 'Click here for directions to the raid.',
        url: urlLink,
        thumbnail: {
          url: levelInfo.imageURL
        },
        color: parseInt(levelInfo.color, 16)
      }
    };
  }

  _buildRaidEmbed() {
    const boss = this.raidEntity.boss;
    const bossData = Utils.pokemonData(boss);
    const gym = this.raidEntity.location;
    const coords = this.raidEntity.coords;
    const urlLink = this._mapLink(coords || gym, coords);

    return {
      embed: {
        title: 'Click here for directions to the raid.',
        url: urlLink,
        thumbnail: {
          url: bossData.imageURL
        },
        color: parseInt(bossData.color, 16)
      }
    };
  }

  _mapLink(location, isLatLng = false) {
    if (isLatLng) {
      return `https://maps.google.com/maps?` +
             `q=${location[0]},${location[1]}&` +
             `ll=${location[0]},${location[1]}&` +
             `z=15`;
    } else {
      return `https://maps.google.com/maps?` +
             `q=${location}&` +
             `z=15`;
    }
  }
  /* eslint-enable quotes */
}

module.exports = Channel;
