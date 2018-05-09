'use strict';

class TestClient {
  constructor(userId = '0') {
    this.user = {};
    this.user.id = userId;

    this.eventHandlers = {};
  }

  on(event, callback) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }

    this.eventHandlers[event].push(callback);
  }

  trigger(event, ...args) {
    if (!this.eventHandlers[event]) return;
    this.eventHandlers[event].forEach(callback => {
      callback(...args);
    });
  }
}

class TestChannel {
  constructor(name) {
    this.name = name;
    this.messages = [];
    this.id = TestChannel.nextId.toString();
    TestChannel.nextId++;
  }

  send(message) {
    if (typeof(message) === 'string' || message instanceof String) {
      message = {
        content: message
      };
    }

    return new Promise(resolve => {
      this.messages.push(message);
      resolve(message);
    });
  }
}

TestChannel.nextId = 0;

class TestChannelStore {
  constructor() {
    this.channels = {};
  }

  create(name) {
    return new Promise(resolve => {
      const newTestChannel = new TestChannel(name);
      this.add(newTestChannel);
      resolve(newTestChannel);
    });
  }

  add(channel) {
    this.channels[channel.id] = channel;
  }

  get(channelId) {
    return this.channels[channelId];
  }
}

class TestGuild {
  constructor(name) {
    this.name = name;
    this.channels = new TestChannelStore();
    this.id = TestGuild.nextId.toString();
    TestGuild.nextId++;
  }
}

TestGuild.nextId = 0;

module.exports = {
  TestClient: TestClient,
  TestChannel: TestChannel,
  TestChannelStore: TestChannelStore,
  TestGuild: TestGuild
};
