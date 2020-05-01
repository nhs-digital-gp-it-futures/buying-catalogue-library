import express from 'express';
import request from 'supertest';
import { healthRoutes } from './index';
import * as apiProvider from '../../apiProvider';

jest.mock('../../apiProvider', () => ({
  getData: jest.fn(),
}));

const mockLogger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

const setupTestApp = () => {
  const app = express();
  const router = express.Router();
  app.use(router);
  return { app, router };
};

describe('healthRoutes', () => {
  describe('/health/live', () => {
    it('should return "Healthy"', () => {
      const { app, router } = setupTestApp();

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
      it('should return "200 + Healthy" if the response from the dependency is "Healthy"', () => {
        apiProvider.getData.mockResolvedValueOnce('some-response');

        const { app, router } = setupTestApp();

        const dependencies = [{
          name: 'some healthy dependency',
          endpoint: 'http://some-endpoint',
        }];

        healthRoutes({ router, dependencies, logger: mockLogger });

        return request(app).get('/health/ready')
          .expect(200)
          .then((res) => {
            expect(res.text).toBe('Healthy');
          });
      });

      it('should return "503 + Unhealthy" if the response from a critcal dependency caused an error', () => {
        apiProvider.getData.mockRejectedValueOnce({ response: { status: 500 } });

        const { app, router } = setupTestApp();

        const dependencies = [{
          name: 'some healthy dependency',
          endpoint: 'http://some-endpoint',
          critical: true,
        }];

        healthRoutes({ router, dependencies, logger: mockLogger });

        return request(app).get('/health/ready')
          .expect(503)
          .then((res) => {
            expect(res.text).toBe('Unhealthy');
          });
      });

      it('should return "200 + Degraded" if the response from a critcal dependency caused an error', () => {
        apiProvider.getData.mockRejectedValueOnce({ response: { status: 500 } });

        const { app, router } = setupTestApp();

        const dependencies = [{
          name: 'some healthy dependency',
          endpoint: 'http://some-endpoint',
        }];

        healthRoutes({ router, dependencies, logger: mockLogger });

        return request(app).get('/health/ready')
          .expect(200)
          .then((res) => {
            expect(res.text).toBe('Degraded');
          });
      });
    });
  });
});
