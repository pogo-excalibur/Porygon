'use strict';

const Action = require('./action');
const Channel = require('./../channel');
const MessageParsing = require('./../message-parsing');

class CreateChannelFromReaction extends Action {
  run(reaction, user) {
    const message = reaction.message;
    const guild = this.porygon.guilds[message.guild.id];

    if (guild.raidInfoChannels.includes(message.channel)) {
      const raidEntity = MessageParsing.parseEmbed(
        message.embeds[0], message.createdTimestamp);
      const channel = new Channel(guild, raidEntity, user);
      if (!raidEntity) {
        console.error(`Could not parse message ${message.id}.`);
      }

      if (!guild.raidChannels[channel.id]) {
        guild.raidChannels[channel.id] = channel;
        channel
          .createDiscordChannel()
          .catch(console.error);
      }
    }
  }
}

module.exports = CreateChannelFromReaction;

