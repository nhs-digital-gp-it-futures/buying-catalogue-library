import cheerio from 'cheerio';

const extractCsrfToken = ({ res }) => {
  const $ = cheerio.load(res.text);
  return $('[name=_csrf]').val();
};

export const getCsrfTokenFromGet = async ({ app, csrfPagePath, mockAuthorisedCookie }) => {
  let cookies;
  let csrfToken;

  await app
    .get(csrfPagePath)
    .set('Cookie', mockAuthorisedCookie)
    .then((getRes) => {
      cookies = getRes.headers['set-cookie'];
      csrfToken = extractCsrfToken(getRes);
    });
  return { cookies, csrfToken };
};

export const testAuthorisedGetPathForUnauthenticatedUser = ({
  app, pathToTest, expectedRedirectPath,
}) => app
  .get(pathToTest)
  .expect(302)
  .then((res) => {
    expect(res.redirect).toEqual(true);
    expect(res.headers.location).toEqual(expectedRedirectPath);
  });

export const testAuthorisedGetPathForUnauthorisedUser = ({
  app,
  pathToTest,
  mockUnauthorisedCookie,
  expectedPageId,
  expectedPageMessage,
}) => {
  app
    .get(pathToTest)
    .set('Cookie', [mockUnauthorisedCookie])
    .expect(200)
    .then((res) => {
      expect(res.text.includes(expectedPageId)).toEqual(true);
      expect(res.text.includes(expectedPageMessage)).toEqual(true);
    });
};

export const testPostPathWithoutCsrf = ({ app, pathToTest, mockAuthorisedCookie }) => app
  .post(pathToTest)
  .set('Cookie', [mockAuthorisedCookie])
  .type('form')
  .send({})
  .then((res) => {
    expect(res.status).toEqual(403);
  });

export const testAuthorisedPostPathForUnauthenticatedUser = async ({
  app, csrfPagePath, pathToTest, mockAuthorisedCookie, expectedRedirectPath,
}) => {
  const { cookies, csrfToken } = await getCsrfTokenFromGet({
    app, csrfPagePath, mockAuthorisedCookie,
  });
  return app
    .post(pathToTest)
    .type('form')
    .set('Cookie', [cookies])
    .send({
      _csrf: csrfToken,
    })
    .expect(302)
    .then((res) => {
      expect(res.redirect).toEqual(true);
      expect(res.headers.location).toEqual(expectedRedirectPath);
    });
};

export const testAuthorisedPostPathForUnauthorisedUsers = async ({
  app,
  csrfPagePath,
  pathToTest,
  mockAuthorisedCookie,
  mockUnauthorisedCookie,
  expectedPageId,
  expectedPageMessage,
}) => {
  const { cookies, csrfToken } = await getCsrfTokenFromGet({
    app, csrfPagePath, mockAuthorisedCookie,
  });

  return app
    .post(pathToTest)
    .type('form')
    .set('Cookie', [cookies, mockUnauthorisedCookie])
    .send({ _csrf: csrfToken })
    .expect(200)
    .then((res) => {
      expect(res.text.includes(expectedPageId)).toEqual(true);
      expect(res.text.includes(expectedPageMessage)).toEqual(true);
    });
};
