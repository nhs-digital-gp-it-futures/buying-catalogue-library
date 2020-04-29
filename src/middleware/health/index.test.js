import express from 'express';
import request from 'supertest';
import { healthRoutes } from './index';

describe('healthRoutes', () => {
  describe('/health/live', () => {
    it('should return "Healthy"', () => {
      const app = express();
      const router = express.Router();
      app.use(router);

      healthRoutes({ router });

      return request(app).get('/health/live')
        .expect(200)
        .then((res) => {
          expect(res.text).toBe('Healthy');
        });
    });
  });

  describe('/health/ready', () => {

  });
});
