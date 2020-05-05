export const extractAccessToken = ({ req, tokenType }) => req.session
  && req.session.accessToken && req.session.accessToken[`${tokenType}_token`];

export const authenticationRoutes = ({
  router, authProvider, tokenType, logoutRedirectPath,
}) => {
  router.get('/login', authProvider.login());

  router.get('/oauth/callback', authProvider.loginCallback());

  router.get('/logout', async (req, res) => {
    const url = await authProvider.logout({ idToken: extractAccessToken({ req, tokenType }) });
    res.redirect(url);
  });

  router.get('/signout-callback-oidc', async (req, res) => {
    if (req.logout) req.logout();
    req.session = null;

    if (req.headers.cookie) {
      req.headers.cookie.split(';')
        .map(cookie => cookie.split('=')[0])
        .forEach(cookieKey => res.clearCookie(cookieKey));
    }

    res.redirect(logoutRedirectPath);
  });
};
