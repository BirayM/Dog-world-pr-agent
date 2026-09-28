import { describe, it, expect } from 'vitest';
import { filterByRegion, listRegions, validateDog } from '../../src/dogs.js';

const dogs = [
  { id: 1, region: 'asie' },
  { id: 2, region: 'europe' },
  { id: 3, region: 'asie' },
];

describe('filterByRegion', () => {
  it('retourne tout sans filtre', () => expect(filterByRegion(dogs)).toHaveLength(3));
  it('retourne tout avec "all"', () => expect(filterByRegion(dogs, 'all')).toHaveLength(3));
  it('filtre par région', () => expect(filterByRegion(dogs, 'asie')).toHaveLength(2));
});

describe('listRegions', () => {
  it('compte les chiens par région existante', () => {
    expect(listRegions(dogs)).toEqual([
      { id: 'asie', label: 'Asie', count: 2 },
      { id: 'europe', label: 'Europe', count: 1 },
    ]);
  });
});

describe('validateDog', () => {
  const valid = { name: 'Saluki', country: 'EAU', region: 'moyen-orient', description: 'Lévrier ancien et rapide.' };

  it('accepte un chien valide', () => expect(validateDog(valid).valid).toBe(true));
  it('refuse une région inconnue', () => expect(validateDog({ ...valid, region: 'mars' }).valid).toBe(false));
  it('refuse une description trop courte', () => expect(validateDog({ ...valid, description: 'court' }).valid).toBe(false));
  it('refuse une entrée vide', () => expect(validateDog(undefined).errors.length).toBeGreaterThan(0));
});
