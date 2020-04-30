import express from 'express';
import request from 'supertest';
import axios from 'axios';
import { healthRoutes } from './index';

jest.mock('axios');

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
    describe('When there is only one dependency', () => {
      it('should return "Healthy" if the response from the dependency is "Healthy"', () => {
        axios.get.mockImplementationOnce(() => Promise.resolve('blah'));
        
        const app = express();
        const router = express.Router();
        app.use(router);

        const dependencies = [{
          name: 'some healthy dependency',
          endpoint: 'http://some-endpoint',
        }];

        healthRoutes({ router, dependencies });

        return request(app).get('/health/ready')
          .expect(200)
          .then((res) => {
            expect(res.text).toBe('Healthy');
          });
      });
    });
  });
});
