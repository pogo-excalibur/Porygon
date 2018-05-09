'use strict';

class Action {
  constructor(porygon) {
    if (new.target === Action) {
      throw new TypeError('Action is an abstract class an should not be ' +
                          'used directly.');
    }

    if (this.run === undefined) {
      throw new TypeError('Subclasses must provide an implementation for ' +
                          'the run() method.');
    }

    this.porygon = porygon;
  }
}

module.exports = Action;
