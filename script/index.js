import { fetchPokemons } from './fetchPokemons.js';
import { fetchPokemon } from './fetchPokemon.js';
import fs from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { fetchUrl } from "./util.js";

async function getEvolutionChain(chainUrl) {
  const data = await fetchUrl(chainUrl);
  return data;
}

async function exec() {
  const results = await fetchPokemons();
  const pokemons = {};
  for (const pokemonData of results) {
    const pokemon = await fetchPokemon(pokemonData.url);
    console.log(pokemon, pokemon.name);
    pokemons[pokemon.name] ??= {};
    Object.assign(pokemons[pokemon.name], pokemon);


    if (pokemon.evolves_from) {
      pokemons[pokemon.evolves_from] ??= {};
      pokemons[pokemon.evolves_from].evolutions ??= [];
      pokemons[pokemon.evolves_from].evolutions.push(pokemon.name);
    }
  }

  const json = JSON.stringify(pokemons);
  const data = new Uint8Array(Buffer.from(json));
  await fs.writeFile('db.json', data);
}

// fetch all pokemons
exec()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })




