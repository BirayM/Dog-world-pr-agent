import { readFileSync } from 'node:fs';

export const REGIONS = {
  afrique: 'Afrique',
  'amerique-nord': 'Amérique du Nord',
  'amerique-sud': 'Amérique du Sud',
  asie: 'Asie',
  europe: 'Europe',
  'moyen-orient': 'Moyen-Orient',
  oceanie: 'Océanie',
  scandinavie: 'Scandinavie',
};

export function loadDogs() {
  const file = new URL('../data/dogs.json', import.meta.url);
  return JSON.parse(readFileSync(file, 'utf8'));
}

export function filterByRegion(dogs, region) {
  if (!region || region === 'all') return dogs;
  return dogs.filter((dog) => dog.region === region);
}

export function listRegions(dogs) {
  const counts = {};
  for (const dog of dogs) counts[dog.region] = (counts[dog.region] ?? 0) + 1;
  return Object.keys(REGIONS)
    .filter((id) => counts[id])
    .map((id) => ({ id, label: REGIONS[id], count: counts[id] }));
}

function checkText(value, label, min, max, errors) {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
    errors.push(`${label} doit contenir entre ${min} et ${max} caractères`);
  }
}

export function validateDog(input) {
  const errors = [];
  const dog = input ?? {};
  checkText(dog.name, 'name', 2, 50, errors);
  checkText(dog.country, 'country', 2, 60, errors);
  checkText(dog.description, 'description', 10, 300, errors);
  if (!Object.hasOwn(REGIONS, dog.region)) errors.push('region inconnue');
  return { valid: errors.length === 0, errors };
}
