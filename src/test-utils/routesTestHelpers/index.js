import cheerio from 'cheerio';

const extractCsrfToken = ({ res }) => {
  const $ = cheerio.load(res.text);
  return $('[name=_csrf]').val();
};

export const getCsrfTokenFromGet = async ({
  app, getPath, getPathCookies = [],
}) => {
  let cookies;
  let csrfToken;

  await app
    .get(getPath)
    .set('Cookie', getPathCookies)
    .then((getRes) => {
      cookies = getRes.headers['set-cookie'];
      csrfToken = extractCsrfToken(getRes);
    });
  return { cookies, csrfToken };
};

export const testAuthorisedGetPathForUnauthenticatedUser = ({
  app, getPath, expectedRedirectPath,
}) => app
  .get(getPath)
  .expect(302)
  .then((res) => {
    expect(res.redirect).toEqual(true);
    expect(res.headers.location).toEqual(expectedRedirectPath);
  });

export const testAuthorisedGetPathForUnauthorisedUser = ({
  app,
  getPath,
  getPathCookies,
  expectedPageId,
  expectedPageMessage,
}) => {
  app
    .get(getPath)
    .set('Cookie', getPathCookies)
    .expect(200)
    .then((res) => {
      expect(res.text.includes(expectedPageId)).toEqual(true);
      expect(res.text.includes(expectedPageMessage)).toEqual(true);
    });
};

export const testPostPathWithoutCsrf = ({ app, postPath, postPathCookies }) => app
  .post(postPath)
  .set('Cookie', postPathCookies)
  .type('form')
  .send({})
  .then((res) => {
    expect(res.status).toEqual(403);
  });

export const testAuthorisedPostPathForUnauthenticatedUser = async ({
  app, getPath, postPath, getPathCookies, postPathCookies, expectedRedirectPath,
}) => {
  const { cookies, csrfToken } = await getCsrfTokenFromGet({
    app, getPath, getPathCookies,
  });
  return app
    .post(postPath)
    .type('form')
    .set('Cookie', [cookies, ...postPathCookies])
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
  getPath,
  postPath,
  getPathCookies,
  postPathCookies,
  expectedPageId,
  expectedPageMessage,
}) => {
  const { cookies, csrfToken } = await getCsrfTokenFromGet({
    app, getPath, getPathCookies,
  });

  return app
    .post(postPath)
    .type('form')
    .set('Cookie', [cookies, ...postPathCookies])
    .send({ _csrf: csrfToken })
    .expect(200)
    .then((res) => {
      expect(res.text.includes(expectedPageId)).toEqual(true);
      expect(res.text.includes(expectedPageMessage)).toEqual(true);
    });
};
