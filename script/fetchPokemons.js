import { fetchUrl } from './util.js'

export async function fetchPokemons() {
  let nextUrl = "https://pokeapi.co/api/v2/pokemon";
  let results = [];

  while(nextUrl) {
    const data = await fetchUrl(nextUrl);
    results = results.concat(data.results);
    nextUrl = data.next;
  }

  return results;
}

