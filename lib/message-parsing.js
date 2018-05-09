'use strict';

const moment = require('moment');

const Egg = require('./egg');
const Raid = require('./raid');
const Utils = require('./utils');

function parseEmbed(embed, timestamp) {
  const coordsMatch = embed.url.match(/q=([\d.]+)%2C([\d.]+)/);
  const coords = [coordsMatch[1], coordsMatch[2]];

  const eggMatch = embed.title.match(/A level (\d+) egg has appeared at ([\s\S]+)/);
  const eggHatchTimeMatch = embed.description.match(/at (\d+):(\d+):(\d+)/);
  if (eggMatch && eggHatchTimeMatch) {
    const eggHatchTime = moment(timestamp)
      .hour(eggHatchTimeMatch[1])
      .minute(eggHatchTimeMatch[2])
      .second(eggHatchTimeMatch[3]);
  
    return new Egg({
      level: eggMatch[1],
      hatchTime: eggHatchTime,
      location: eggMatch[2],
      coords: coords
    });
  }

  const raidMatch = embed.title.match(/An? ([\s\S]+) raid is starting at ([\s\S]+)/);
  const raidEndTimeMatch = embed.description.match(/until (\d+):(\d+):(\d+)/);
  if (raidMatch && raidEndTimeMatch) {
    const raidEndTime = moment(timestamp)
      .hour(raidEndTimeMatch[1])
      .minute(raidEndTimeMatch[2])
      .second(raidEndTimeMatch[3]);
  
    return new Raid({
      boss: raidMatch[1],
      endTime: raidEndTime,
      location: raidMatch[2],
      coords: coords
    });
  }

  /* Error */
}

function parseRaidCreateMessage(message) {
  const content = message.content;
  const contentParts = content.split(' ');
  const firstWord = (contentParts[0] || '').toLowerCase();
  const afterFirstWord = contentParts.slice(1).join(' ');

  const eggMatch = (content.match(/([12345])([\s\S]+)/));
  const raidBossNameMatch = Utils.FUZZY_RAID_BOSS_NAMES.get(firstWord);
  const pokemonNameMatch = Utils.FUZZY_POKEMON_NAMES.get(firstWord);

  /*
   * Summary:
   * 1. High match with a raid boss   -> raid
   * 2. High match with a pokemon     -> raid
   * 3. Number in the range 1 to 5    -> egg
   * 4. Medium match with a raid boss -> raid
   * 5. Medium match with a pokemon   -> raid
   * 6. No matches                    -> text
   */

  let raidLevel;
  let raidBoss;

  if (raidBossNameMatch && raidBossNameMatch[0][0] > 0.7) {
    raidBoss = raidBossNameMatch[0][1];
  } else if (pokemonNameMatch && pokemonNameMatch[0][0] > 0.75) {
    raidBoss = pokemonNameMatch[0][1];
  } else if (eggMatch) {
    raidLevel = eggMatch[1];
  } else if (raidBossNameMatch && raidBossNameMatch[0][0] > 0.5) {
    raidBoss = raidBossNameMatch[0][1];
  } else if (pokemonNameMatch && pokemonNameMatch[0][0] > 0.6) {
    raidBoss = pokemonNameMatch[0][1];
  } else {
    return;
  }

  let location;
  if (raidLevel) {
    location = eggMatch[2].trim();
  } else {
    let locationMatch = afterFirstWord.match(/^@*([\s\S]+)/);
    if (locationMatch) {
      location = locationMatch[1].trim();
    }
  }

  if ((raidLevel || raidBoss) && !location) {
    console.error('Could not parse a location.');
    return;
  }

  if (raidLevel) {
    return new Egg({
      level: raidLevel,
      location: location
    });
  } else if (raidBoss) {
    return new Raid({
      boss: raidBoss,
      location: location
    });
  }
}

module.exports = {
  parseEmbed: parseEmbed,
  parseRaidCreateMessage: parseRaidCreateMessage
};
