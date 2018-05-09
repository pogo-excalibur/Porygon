'use strict';

const Discord = require('discord.js');

const Utils = require('./utils');
const Actions = require('./actions/actions');

class Porygon {
  constructor(discordToken, options = {}) {
    this.discordToken = discordToken;

    this.options = this._defaultOptions();
    Object.assign(this.options, options);

    this.client = this.options.client;
    this.guilds = this.options.guilds;
  }

  login() {
    this._setup();
    return this.client.login(this.discordToken);
  }

  addAction(event, action) {
    this.client.on(event, (...args) => {
      action.run(...args);
    });
  }

  addActionType(event, actionType) {
    this.addAction(event, new actionType(this));
  }

  _defaultOptions() {
    return {
      client: new Discord.Client(),
      guildSettings: Utils.GUILD_SETTINGS,
      guilds: {},
      defaultActions: true
    };
  }

  _setup() {
    if (this.options.defaultActions) {
      this._setupDefaultActions();
    }
  }

  _setupDefaultActions() {
    this.addActionType('ready', Actions.Login);
    this.addActionType('message', Actions.CreateChannelFromMessage);
    this.addActionType('messageReactionAdd', Actions.CreateChannelFromReaction);
  }
}

module.exports = Porygon;
