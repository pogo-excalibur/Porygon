'use strict';

const Action = require('./action');
const Channel = require('./../channel');
const MessageParsing = require('./../message-parsing');

class CreateChannelFromMessage extends Action {
  run(message) {
    if (message.author.id == this.porygon.client.user.id) return;

    const guild = this.porygon.guilds[message.guild.id];

    if (guild.raidCreateChannels.includes(message.channel)) {
      const raidEntity = MessageParsing.parseRaidCreateMessage(message);
      if (!raidEntity) {
        message.channel
          .send(
            '**Command not understood**\n' +
            'To create an egg channel use the format \'t5 st peters church\'.\n' + 
            'To create a raid channel use the format \'tyranitar guildhall clock\'.'
          )
          .catch(console.error);
        return;
      }

      const channel = new Channel(guild, raidEntity, message.author);
      const existingChannel = guild.raidChannels[channel.id];
      const knownRaid = guild.knownRaids[channel.id];
      if (existingChannel) {
        message.channel
          .send(
            '**There\'s already a raid channel for that gym**\n' +
            `Head over to <#${existingChannel.discordChannel.id}>`)
          .catch(console.error);
      } else if (knownRaid) {
        guild.raidChannels[channel.id] = channel;
        knownRaid
          .createDiscordChannel()
          .catch(console.error);
      } else {
        guild.raidChannels[channel.id] = channel;
        channel
          .createDiscordChannel()
          .catch(console.error);
      }
    }
  }
}

module.exports = CreateChannelFromMessage;
