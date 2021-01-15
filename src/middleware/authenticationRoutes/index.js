export const extractAccessToken = ({ req, tokenType }) => req.session
  && req.session.accessToken && req.session.accessToken[`${tokenType}_token`];

export const authenticationRoutes = ({
  router, authProvider, tokenType, logoutRedirectPath, logger,
}) => {
  router.get('/login', async (req, res, next) => {
    logger.info('login called');
    return authProvider.login()(req, res, next);
  });

  router.get('/oauth/callback', async (req, res, next) => {
    logger.info('login callback called');
    return authProvider.loginCallback()(req, res, next);
  });

  router.get('/logout', async (req, res) => {
    logger.info('logout called');
    const url = await authProvider.logout({ idToken: extractAccessToken({ req, tokenType }) });
    res.redirect(url);
  });

  router.get('/signout-callback-oidc', async (req, res) => {
    logger.info('logout callback called');
    if (req.logout) req.logout();
    req.session = null;

    if (req.headers.cookie) {
      req.headers.cookie.split(';')
        .map((cookie) => cookie.split('=')[0])
        .forEach((cookieKey) => res.clearCookie(cookieKey));
    }

    res.redirect(logoutRedirectPath);
  });
};
