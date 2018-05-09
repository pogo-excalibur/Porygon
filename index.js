'use strict';

require('dotenv').config();

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled rejection at: Promise ', p, ' reason: ', reason);
});

const Porygon = require('./lib/porygon');

const discordToken = process.env.DISCORD_TOKEN;

const porygon = new Porygon(discordToken);
porygon
  .login()
  .catch(console.error);
