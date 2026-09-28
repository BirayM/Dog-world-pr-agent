import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('API', () => {
  it('GET /healthz', async () => {
    const res = await request(createApp()).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /api/dogs retourne les 5 chiens', async () => {
    const res = await request(createApp()).get('/api/dogs');
    expect(res.body).toHaveLength(5);
  });

  it('GET /api/dogs?region=asie filtre', async () => {
    const res = await request(createApp()).get('/api/dogs?region=asie');
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Akita Inu');
  });

  it('GET /api/dogs?region=inconnue renvoie 400', async () => {
    const res = await request(createApp()).get('/api/dogs?region=mars');
    expect(res.status).toBe(400);
  });

  it('POST /api/dogs crée un chien', async () => {
    const app = createApp();
    const res = await request(app).post('/api/dogs').send({
      name: 'Saluki', country: 'EAU', region: 'moyen-orient', description: 'Lévrier ancien et rapide.',
    });
    expect(res.status).toBe(201);
    expect((await request(app).get('/api/dogs')).body).toHaveLength(6);
  });

  it('POST /api/dogs refuse un corps invalide', async () => {
    const res = await request(createApp()).post('/api/dogs').send({ name: 'x' });
    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('envoie les headers de sécurité helmet', async () => {
    const res = await request(createApp()).get('/healthz');
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});
