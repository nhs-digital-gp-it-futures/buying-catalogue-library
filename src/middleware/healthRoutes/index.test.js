import express from 'express';
import request from 'supertest';
import { healthRoutes } from './index';
import { getData } from '../../apiProvider';

jest.mock('../../apiProvider');

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
  afterEach(() => {
    getData.mockReset();
  });

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
    describe('when there is only one dependency', () => {
      it('should return "200 + Healthy" if the response from the dependency is "Healthy"', () => {
        getData.mockResolvedValueOnce('some-response');

        const { app, router } = setupTestApp();

        const dependencies = [{
          name: 'some healthy dependency',
          endpoint: 'http://some-endpoint',
        }];

        healthRoutes({ router, dependencies, logger: mockLogger });

        return request(app).get('/health/ready')
          .expect(200)
          .then((res) => {
            expect(getData.mock.calls.length).toEqual(1);
            expect(res.text).toBe('Healthy');
          });
      });

      it('should return "503 + Unhealthy" if the response from a critcal dependency caused an error', () => {
        getData.mockRejectedValueOnce({ response: { status: 500 } });

        const { app, router } = setupTestApp();

        const dependencies = [{
          name: 'some critcal unhealthy dependency',
          endpoint: 'http://some-endpoint',
          critical: true,
        }];

        healthRoutes({ router, dependencies, logger: mockLogger });

        return request(app).get('/health/ready')
          .expect(503)
          .then((res) => {
            expect(getData.mock.calls.length).toEqual(1);
            expect(res.text).toBe('Unhealthy');
          });
      });

      it('should return "200 + Degraded" if the response from a critcal dependency caused an error', () => {
        getData.mockRejectedValueOnce({ response: { status: 500 } });

        const { app, router } = setupTestApp();

        const dependencies = [{
          name: 'some unhealthy dependency',
          endpoint: 'http://some-endpoint',
        }];

        healthRoutes({ router, dependencies, logger: mockLogger });

        return request(app).get('/health/ready')
          .expect(200)
          .then((res) => {
            expect(getData.mock.calls.length).toEqual(1);
            expect(res.text).toBe('Degraded');
          });
      });
    });

    describe('when there are multiple dependencies', () => {
      it('should return "200 + Healthy" if the response from all dependencies is "Healthy"', () => {
        getData.mockResolvedValueOnce('some-response')
          .mockResolvedValueOnce('another-response');

        const { app, router } = setupTestApp();

        const dependencies = [
          {
            name: 'some healthy dependency',
            endpoint: 'http://some-endpoint',
          },
          {
            name: 'another healthy dependency',
            endpoint: 'http://another-endpoint',
          },
        ];

        healthRoutes({ router, dependencies, logger: mockLogger });

        return request(app).get('/health/ready')
          .expect(200)
          .then((res) => {
            expect(getData.mock.calls.length).toEqual(2);
            expect(res.text).toBe('Healthy');
          });
      });

      it('should return "503 + Unhealthy" if the response from at least of the critical dependencies caused an error', () => {
        getData.mockResolvedValueOnce('some-response')
          .mockRejectedValueOnce({ response: { status: 500 } })
          .mockRejectedValueOnce({ response: { status: 500 } });

        const { app, router } = setupTestApp();

        const dependencies = [
          {
            name: 'some healthy dependency',
            endpoint: 'http://some-endpoint',
          },
          {
            name: 'a critical unhealthy dependency',
            endpoint: 'http://another-endpoint',
            critical: true,
          },
          {
            name: 'a non-critical unhealthy dependency',
            endpoint: 'http://another-endpoint',
          },
        ];

        healthRoutes({ router, dependencies, logger: mockLogger });

        return request(app).get('/health/ready')
          .expect(503)
          .then((res) => {
            expect(getData.mock.calls.length).toEqual(3);
            expect(res.text).toBe('Unhealthy');
          });
      });

      it('should return "200 + Degraded" if the response from at least of the dependencies caused an error', () => {
        getData.mockResolvedValueOnce('some-response')
          .mockResolvedValueOnce('another-response')
          .mockRejectedValueOnce({ response: { status: 500 } });

        const { app, router } = setupTestApp();

        const dependencies = [
          {
            name: 'some healthy dependency',
            endpoint: 'http://some-endpoint',
          },
          {
            name: 'a critical healthy dependency',
            endpoint: 'http://another-endpoint',
            critical: true,
          },
          {
            name: 'a non-critical unhealthy dependency',
            endpoint: 'http://another-endpoint',
          },
        ];

        healthRoutes({ router, dependencies, logger: mockLogger });

        return request(app).get('/health/ready')
          .expect(200)
          .then((res) => {
            expect(getData.mock.calls.length).toEqual(3);
            expect(res.text).toBe('Degraded');
          });
      });
    });
  });
});
