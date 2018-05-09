'use strict';

const Utils = require('./utils');
const { TestClient } = require('./mocks');

const Porygon = require('../lib/porygon');
const Actions = require('../lib/actions/actions');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['awesome'] = {
  setUp: done => {
    this.porygon = new Porygon('0', {
      client: new TestClient(),
      defaultActions: false
    });

    this.porygon.addActionType('message', Actions.CreateChannelFromMessage);

    done();
  },
  'create egg with message': test => {
    const testLocation = 'test location';
    const testMessage = {
      content: `t5 ${testLocation}`
    };

    Utils.sendRaidCreateMessage(this.porygon, testMessage)
      .then(guild => {
        const raidChannel = guild.raidChannels[testLocation];
        test.ok(raidChannel);
        test.ok(raidChannel.name.includes('egg'));
        test.done();
      })
      .catch(err => {
        console.error(err);
        test.done();
      });
  },
  'create raid with message (high match)': test => {
    const raidBoss = 'tyranitar';
    const testLocation = 'test location';
    const testMessage = {
      content: `${raidBoss} ${testLocation}`
    };

    Utils.sendRaidCreateMessage(this.porygon, testMessage)
      .then(guild => {
        const raidChannel = guild.raidChannels[testLocation];
        test.ok(raidChannel);
        test.ok(raidChannel.name.includes(raidBoss));
        test.done();
      })
      .catch(err => {
        console.error(err);
        test.done();
      });
  },
  'create raid with message (low match)': test => {
    const raidBossPart = 'tyran';
    const raidBoss = 'tyranitar';
    const testLocation = 'test location';
    const testMessage = {
      content: `${raidBossPart} ${testLocation}`
    };

    Utils.sendRaidCreateMessage(this.porygon, testMessage)
      .then(guild => {
        const raidChannel = guild.raidChannels[testLocation];
        test.ok(raidChannel);
        test.ok(raidChannel.name.includes(raidBoss));
        test.done();
      })
      .catch(err => {
        console.error(err);
        test.done();
      });
  },
  'create raid with message (non-boss pokemon)': test => {
    const raidBoss = 'pidgey';
    const testLocation = 'test location';
    const testMessage = {
      content: `${raidBoss} ${testLocation}`
    };

    Utils.sendRaidCreateMessage(this.porygon, testMessage)
      .then(guild => {
        const raidChannel = guild.raidChannels[testLocation];
        test.ok(raidChannel);
        test.ok(raidChannel.name.includes(raidBoss));
        test.done();
      })
      .catch(err => {
        console.error(err);
        test.done();
      });
  },
  'create raid for existing channel (exact duplicate)': test => {
    const client = this.porygon.client;

    const raidBoss = 'tyranitar';
    const testLocation = 'test location';
    const testMessage1 = {
      content: `${raidBoss} ${testLocation}`
    };

    const testMessage2 = {
      content: `${raidBoss} ${testLocation}`
    };

    Utils.sendRaidCreateMessage(this.porygon, testMessage1)
      .then(guild => {
        const raidCreateChannel = guild.raidCreateChannels[0];
        Utils.sendMessage(client, guild, raidCreateChannel, testMessage2);
        return guild;
      })
      .then(guild => {
        const raidCreateChannel = guild.raidCreateChannels[0];
        test.ok(raidCreateChannel.messages.length === 3);
        const lastMessage = raidCreateChannel.messages[2];
        test.ok(lastMessage.content.includes('There\'s already a raid channel'));
        test.done();
      })
      .catch(err => {
        console.error(err);
        test.done();
      });
  },
  'raid create command not understood': test => {
    const testMessage = {
      content: 'testing'
    };

    Utils.sendRaidCreateMessage(this.porygon, testMessage)
      .then(guild => {
        const raidCreateChannel = guild.raidCreateChannels[0];
        test.ok(raidCreateChannel.messages.length === 2);
        const lastMessage = raidCreateChannel.messages[1];
        test.ok(lastMessage.content.includes('Command not understood'));
        test.done();
      })
      .catch(err => {
        console.error(err);
        test.done();
      });
  }
};
