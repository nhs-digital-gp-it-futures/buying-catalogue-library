import express from 'express';
import request from 'supertest';
import { authenticationRoutes } from './index';
import { FakeAuthProvider } from '../../test-utils/fakeAuthProvider';

const setupTestApp = (mockLogoutMethod) => {
  const app = express();
  const authProvider = new FakeAuthProvider(mockLogoutMethod);
  authProvider.setup(app);
  const router = express.Router();
  app.use(router);
  return { app, router, authProvider };
};

const mockLogger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

describe('GET /login', () => {
  it('should return the correct status and redirect to the login page when not authenticated', () => {
    const { app, router, authProvider } = setupTestApp();

    authenticationRoutes({
      router, authProvider, tokenType: 'id', logoutRedirectPath: 'some-logout-path', logger: mockLogger,
    });

    return request(app)
      .get('/login')
      .expect(302)
      .then((res) => {
        expect(res.redirect).toEqual(true);
        expect(res.headers.location).toEqual('http://identity-server/login');
      });
  });
});

describe('GET /logout', () => {
  it('should redirect to the url provided by authProvider', async () => {
    const mockLogoutMethod = jest.fn().mockImplementation(() => Promise.resolve({}));
    const { app, router, authProvider } = setupTestApp(mockLogoutMethod);

    authenticationRoutes({
      router, authProvider, tokenType: 'id', logoutRedirectPath: 'some-logout-path', logger: mockLogger,
    });

    return request(app)
      .get('/logout')
      .expect(302)
      .then((res) => {
        expect(res.redirect).toEqual(true);
        expect(res.headers.location).toEqual('/signout-callback-oidc');
      });
  });
});

describe('GET /signout-callback-oidc', () => {
  it('should redirect to "some-logout-path"', async () => {
    const mockLogoutMethod = jest.fn().mockImplementation(() => Promise.resolve({}));
    const { app, router, authProvider } = setupTestApp(mockLogoutMethod);

    authenticationRoutes({
      router, authProvider, tokenType: 'id', logoutRedirectPath: 'some-logout-path', logger: mockLogger,
    });

    return request(app)
      .get('/signout-callback-oidc')
      .expect(302)
      .then((res) => {
        expect(res.redirect).toEqual(true);
        expect(res.headers.location).toEqual('some-logout-path');
      });
  });

  it('should call req.logout', async () => {
    const mockLogoutMethod = jest.fn().mockImplementation(() => Promise.resolve({}));
    const { app, router, authProvider } = setupTestApp(mockLogoutMethod);

    authenticationRoutes({
      router, authProvider, tokenType: 'id', logoutRedirectPath: 'some-logout-path', logger: mockLogger,
    });

    request(app)
      .get('/signout-callback-oidc')
      .expect(302)
      .then(() => {
        expect(mockLogoutMethod.mock.calls.length).toEqual(1);
      });
  });

  it('should clear cookies', async () => {
    const expectedClearedCookies = 'cookie1=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';

    const mockLogoutMethod = jest.fn().mockImplementation(() => Promise.resolve({}));
    const { app, router, authProvider } = setupTestApp(mockLogoutMethod);

    authenticationRoutes({
      router, authProvider, tokenType: 'id', logoutRedirectPath: 'some-logout-path', logger: mockLogger,
    });

    return request(app)
      .get('/signout-callback-oidc')
      .set('Cookie', ['cookie1=cookie1value'])
      .expect(302)
      .then((res) => {
        expect(res.headers['set-cookie'].includes(expectedClearedCookies)).toEqual(true);
      });
  });
});
