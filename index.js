import express from 'express';
import _ from 'lodash';
import db from './db.json' with { type: 'json' };

const pokemonsWithImages = Object.keys(db).reduce(function (previous, key) {
  const pokemon = db[key];
  if (pokemon.img) {
    return { ...previous, [key]: db[key] };
  }
  return previous;
}, {})

const pokemonsWithEvolutions = Object.keys(pokemonsWithImages).reduce(function (previous, key) {
  const pokemon = db[key];
  if (pokemon.evolutions) {
    return [...previous, db[key]];
  }
  return previous;
}, []);
const evolvedPokemons = Object.keys(pokemonsWithImages).reduce(function (previous, key) {
  const pokemon = db[key];
  if (pokemon.evolves_from) {
    return [...previous, db[key]];
  }
  return previous;
}, []);


function roll() {
  const selectedPokemon = _.sample(pokemonsWithEvolutions);
  const evolution = { ...db[selectedPokemon.evolutions[0]], correct: true };

  const options = _.chain(evolvedPokemons).sampleSize(3).filter((p) => p.name !== evolution.name).take(2).concat(evolution).shuffle().value();

  return {
    pokemon: selectedPokemon,
    options,
  };
}

const app = express()
app.use(express.static('client'))
const port = 3000

app.get('/api', (req, res) => {
  let currentRoll = roll();

  while (_.some(currentRoll.options, o => !o.img)) {
    currentRoll = roll();
  }

  res.json(currentRoll);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





