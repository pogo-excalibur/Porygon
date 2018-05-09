'use strict';

const { TestGuild } = require('./mocks');

const Guild = require('../lib/guild');

function createGuildWithRaidCreateChannel(porygon) {
  const discordGuild = new TestGuild('TestGuild');

  return discordGuild.channels
    .create('raid-create')
    .then(raidCreateChannel => {
      return new Guild(discordGuild, {
        raidCreateChannelIds: [ raidCreateChannel.id ]
      });
    })
    .then(guild => {
      return guild.setup();
    })
    .then(guild => {
      porygon.guilds[guild.id] = guild;
      return guild;
    });
}

function sendMessage(client, guild, channel, message) {
  message.author = { id: '999' };
  message.guild = guild.discordGuild;
  message.channel = channel;

  return channel
    .send(message)
    .then(message => {
      client.trigger('message', message);
    });
}

function sendRaidCreateMessage(porygon, message) {
  return createGuildWithRaidCreateChannel(porygon)
    .then(guild => {
      const raidCreateChannel = guild.raidCreateChannels[0];

      return sendMessage(porygon.client, guild, raidCreateChannel, message)
        .then(() => {
          return guild;
        });
    });
}

module.exports = {
  createGuildWithRaidCreateChannel: createGuildWithRaidCreateChannel,
  sendMessage: sendMessage,
  sendRaidCreateMessage: sendRaidCreateMessage
};
