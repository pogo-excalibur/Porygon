'use strict';

const Actions = {
  Login: require('./login'),
  CreateChannelFromMessage: require('./create-channel-from-message'),
  CreateChannelFromReaction: require('./create-channel-from-reaction')
};

module.exports = Actions;
