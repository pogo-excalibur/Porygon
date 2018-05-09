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
  'setup egg channel': test => {
    const raidLevel = 5;
    const testLocation = 'test location';
    const testMessage = {
      content: `t${raidLevel} ${testLocation}`
    };

    Utils.sendRaidCreateMessage(this.porygon, testMessage)
      .then(guild => {
        const raidChannel = guild.raidChannels[testLocation];
        const messages = raidChannel.discordChannel.messages;
        test.equal(messages.length, 2);
        const topMessage = messages[0].content;
        test.ok(topMessage.includes(`level ${raidLevel} raid at`) &&
                topMessage.includes('hatch time hasn\'t been set'));
        test.done();
      })
      .catch(err => {
        console.error(err);
        test.done();
      });
  },
  'setup raid channel': test => {
    const raidBoss = 'Tyranitar';
    const testLocation = 'test location';
    const testMessage = {
      content: `${raidBoss} ${testLocation}`
    };

    Utils.sendRaidCreateMessage(this.porygon, testMessage)
      .then(guild => {
        const raidChannel = guild.raidChannels[testLocation];
        const messages = raidChannel.discordChannel.messages;
        test.equal(messages.length, 2);
        const topMessage = messages[0].content;
        test.ok(topMessage.includes(`${raidBoss} raid at`) &&
                topMessage.includes('end time hasn\'t been set'));
        test.done();
      })
      .catch(err => {
        console.error(err);
        test.done();
      });
  }
};
