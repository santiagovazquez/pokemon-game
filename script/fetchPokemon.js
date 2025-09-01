import { fetchUrl } from './util.js';
export async function fetchPokemon(url) {
  const pokemon = await fetchUrl(url);
  const specie = await fetchUrl(pokemon.species.url);

  return {
    name: specie.name,
    img: pokemon.sprites.other.dream_world?.front_default,
    ...(specie.evolves_from_species ? { evolves_from: specie.evolves_from_species.name } : {}),
  };
}
