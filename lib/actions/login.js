'use strict';

const Promise = require('bluebird');

const Action = require('./action');
const Guild = require('./../guild');
const Channel = require('./../channel');
const MessageParsing = require('./../message-parsing');

class Login extends Action {
  run() {
    const client = this.porygon.client;

    console.log(`Logged in as ${client.user.tag}.`);

    const guildSetupPromises = [];
    for (let guildId in this.porygon.options.guildSettings) {
      const settings = this.porygon.options.guildSettings[guildId];

      if (!settings.enabled) continue;

      /* Check that Porygon has access to the server */
      const discordGuild = client.guilds.get(guildId);
      if (!discordGuild) continue;

      const guild = new Guild(discordGuild, settings);

      guildSetupPromises.push(guild.setup());
    }

    return Promise
      .map(guildSetupPromises, guild => {
        this.porygon.guilds[guild.id] = guild;

        /*
         * Fetch the last 100 messages in each raid info channel
         * This allows Porygon to respond to existing messages, and
         * populates the list of known raids
         * Note: Discord only allows fetching up to 100 messages at once
         */
        return Promise.map(guild.raidInfoChannels, channel => {
          return channel.messages
            .fetch({ limit: 100 })
            .then(messages => {
              messages.forEach(message => {
                if (message.embeds && (message.embeds.length > 0)) {
                  const raidEntity = MessageParsing.parseEmbed(
                    message.embeds[0], message.createdTimestamp);
                  const channel = new Channel(guild, raidEntity);

                  if (guild.knownRaids[channel.id]) return;
                  guild.knownRaids[channel.id] = channel;
                }
              });
              return messages;
            });
        });
      })
      .then(results => {
        console.log(`Preloaded messages from ${results.length} guilds(s).`);
      })
      .catch(console.error);
  }
}

module.exports = Login;
