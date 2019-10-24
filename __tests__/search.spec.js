import request from 'supertest';
import app from '..';

describe('Search API Route Test', () => {
  it('should return a result when searching with custom parameters', async (done) => {
    const res = await request(app).get('/api/v1/search?searchTerm=teaspoon&filter=recipe&limit=5&page=0');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toEqual('success');
    expect(res.body).toHaveProperty('results');
    expect(res.body.results).toHaveProperty('categories');
    expect(res.body.results).toHaveProperty('recipes');
    expect(res.body.results.categories.length).toEqual(0);
    done();
  });
});
