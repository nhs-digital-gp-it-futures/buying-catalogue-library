import express from 'express';
import request from 'supertest';
import { authenticationRoutes } from './index';
import { FakeAuthProvider } from '../../test-utils/fakeAuthProvider';
import { consentCookieName } from '../../config';

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
  afterEach(() => {
    jest.resetAllMocks();
  });

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

  it('should clear the token cookie', async () => {
    const cookieName = 'token';
    const expectedClearedCookies = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    const mockLogoutMethod = jest.fn().mockImplementation(() => Promise.resolve({}));
    const { app, router, authProvider } = setupTestApp(mockLogoutMethod);
    const agent = request.agent(app);

    authenticationRoutes({
      router, authProvider, tokenType: 'id', logoutRedirectPath: 'some-logout-path', logger: mockLogger,
    });

    return agent
      .get('/signout-callback-oidc')
      .set('Cookie', [`${cookieName}=cookie1value`])
      .expect(302)
      .expect('set-cookie', expectedClearedCookies);
  });

  xit('should not clear the consent cookie', async () => {
    const consentCookie = `${consentCookieName}=true`;
    const expectedCookies = `${consentCookie}; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    const mockLogoutMethod = jest.fn().mockImplementation(() => Promise.resolve({}));
    const { app, router, authProvider } = setupTestApp(mockLogoutMethod);
    const agent = request.agent(app);

    authenticationRoutes({
      router, authProvider, tokenType: 'id', logoutRedirectPath: 'some-logout-path', logger: mockLogger,
    });

    // TODO: determine why set-cookie header field is undefined
    return agent
      .set('Cookie', [consentCookie])
      .get('/signout-callback-oidc')
      .expect(302)
      .expect('set-cookie', expectedCookies);
  });
});
