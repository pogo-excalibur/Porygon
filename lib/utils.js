'use strict';

const fs = require('fs');
const FuzzySet = require('fuzzyset.js');

function barePokemonName(pokemonName) {
  const lowerCaseName = pokemonName.toLowerCase();

  /*
   * Don't remove symbols from the nidorans as they would become
   * duplicates of each other in the reverse name map
   */
  if (lowerCaseName.includes('nidoran')) {
    return lowerCaseName;
  } else {
    return lowerCaseName.replace(/[\W]+/g, '');
  }
}

const POKEMON_IMAGES_URL = 'https://raw.githubusercontent.com' +
                           '/pogo-excalibur/images/master/pogo';

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

const POKEMON_DATA_FILE = process.cwd() + '/data/pokemon.json';
const POKEMON_DATA = JSON.parse(fs.readFileSync(POKEMON_DATA_FILE, 'utf8'));
const POKEMON_NAMES = [];
const POKEMON_NAME_REVERSE_MAP = [];
for (let pokemonId in POKEMON_DATA) {
  const data = POKEMON_DATA[pokemonId];

  POKEMON_NAMES.push(data.name);
  POKEMON_NAME_REVERSE_MAP[barePokemonName(data.name)] = parseInt(pokemonId);

  if (VOWELS.includes(data.name[0].toLowerCase())) {
    data.article = 'an';
  } else {
    data.article = 'a';
  }

  data.imageURL = `${POKEMON_IMAGES_URL}/${pokemonId}.png`;
}

const FUZZY_POKEMON_NAMES = FuzzySet(POKEMON_NAMES);

function pokemonData(pokemonId) {
  if (POKEMON_DATA[pokemonId]) {
    return POKEMON_DATA[pokemonId];
  }

  /* Try assuming that the parameter is a pokemon name */
  pokemonId = POKEMON_NAME_REVERSE_MAP[barePokemonName(pokemonId)];
  return POKEMON_DATA[pokemonId];
}

const RAID_IMAGES_URL = 'https://raw.githubusercontent.com' +
                        '/PokeAlarm/PokeAlarm' +
                        '/b64c3eec4ac8d747db26b14756ef71e5b2820203/icons';

const RAID_LEVELS_FILE = process.cwd() + '/data/raid_levels.json';
const RAID_LEVEL_DATA = JSON.parse(fs.readFileSync(RAID_LEVELS_FILE, 'utf8'));

const RAID_BOSS_NAMES = [];
for (let level in RAID_LEVEL_DATA) {
  const data = RAID_LEVEL_DATA[level];

  data.bosses.forEach(bossId => {
    const bossData = pokemonData(bossId);
    RAID_BOSS_NAMES.push(bossData.name);
  });

  let imageLevel = level;
  if (level == 'EX') {
    imageLevel = 5;
  }
  
  data.imageURL = `${RAID_IMAGES_URL}/egg_${imageLevel}.png`;
}

const FUZZY_RAID_BOSS_NAMES = FuzzySet(RAID_BOSS_NAMES);

function raidLevelData(level) {
  return RAID_LEVEL_DATA[level];
}

const GUILD_SETTINGS_FILE = process.cwd() + '/data/guild_settings.json';
const GUILD_SETTINGS = JSON.parse(fs.readFileSync(GUILD_SETTINGS_FILE, 'utf8'));

module.exports = {
  pokemonData: pokemonData,
  raidLevelData: raidLevelData,
  FUZZY_RAID_BOSS_NAMES: FUZZY_RAID_BOSS_NAMES,
  FUZZY_POKEMON_NAMES: FUZZY_POKEMON_NAMES,
  GUILD_SETTINGS: GUILD_SETTINGS
};
