'use strict';

const Porygon = require('../lib/porygon');
const Action = require('../lib/actions/action');

const { TestClient } = require('./mocks');

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

class TestActionModifyObject extends Action {
  constructor(porygon, object) {
    super(porygon);
    this.object = object || {};
  }

  run(key, value) {
    this.object[key] = value;
  }
}

class TestActionModifyPorygon extends Action {
  run(value) {
    this.porygon.testValue = value;
  }
}

exports['awesome'] = {
  setUp: done => {
    done();
  },
  'add action': test => {
    test.expect(1);

    const porygon = new Porygon('0', {
      client: new TestClient(),
      defaultActions: false
    });

    const testObject = { testValue: 0 };
    porygon.addAction('test', new TestActionModifyObject(porygon, testObject));

    const newValue = 1;
    porygon.client.trigger('test', 'testValue', newValue);

    test.equal(testObject.testValue, newValue);
    test.done();
  },
  'add action type': test => {
    test.expect(1);

    const porygon = new Porygon('0', {
      client: new TestClient(),
      defaultActions: false
    });

    const testValue = 0;
    porygon.testValue = testValue;

    porygon.addActionType('test', TestActionModifyPorygon);

    const newValue = 1;
    porygon.client.trigger('test', newValue);

    test.equal(porygon.testValue, newValue);
    test.done();
  }
};
