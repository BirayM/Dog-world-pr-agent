import express from 'express';
import helmet from 'helmet';
import { fileURLToPath } from 'node:url';
import { REGIONS, loadDogs, filterByRegion, listRegions, validateDog } from './dogs.js';

export function createApp() {
  const app = express();
  const dogs = loadDogs();

  app.use(helmet());
  app.use(express.json({ limit: '10kb' }));
  app.use(express.static(fileURLToPath(new URL('../public', import.meta.url))));

  app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));

  app.get('/api/regions', (_req, res) => res.json(listRegions(dogs)));

  app.get('/api/dogs', (req, res) => {
    const { region } = req.query;
    if (region && region !== 'all' && !Object.hasOwn(REGIONS, region)) {
      return res.status(400).json({ error: 'Région inconnue' });
    }
    return res.json(filterByRegion(dogs, region));
  });

  app.post('/api/dogs', (req, res) => {
    const { valid, errors } = validateDog(req.body);
    if (!valid) return res.status(400).json({ errors });
    const { name, country, region, description } = req.body;
    const dog = {
      id: dogs.length + 1,
      name: name.trim(),
      country: country.trim(),
      flag: '',
      region,
      emoji: '🐕',
      description: description.trim(),
    };
    dogs.push(dog);
    return res.status(201).json(dog);
  });

  return app;
}
