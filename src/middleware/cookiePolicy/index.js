import config from '../../config';

const currentTimeInMillisecods = new Date().getTime();

export const cookiePolicyAgreed = ({ res, logger }) => {
  const millisecondsInOneYear = 31556926000;
  const cookieData = {
    cookieValue: true,
    creationDate: new Date().getTime(),
  };
  res.cookie(config.consentCookieName, `${JSON.stringify(cookieData)}`, { maxAge: millisecondsInOneYear });

  logger.info(`creating ${config.consentCookieName} cookie`);
};

export const cookiePolicyExists = ({ req, logger }) => {
  const value = req.cookies[config.consentCookieName];
  logger.info(`get ${config.consentCookieName} cookie, has value ${value}`);
  return value !== undefined;
};

export const cookiePolicyClear = ({ res, logger }) => {
  res.clearCookie(config.consentCookieName);
  logger.info(`clear ${config.consentCookieName} cookie`);
};

export const consentCookieExpiration = ({ router, logger }) => {
  if (config.buyingCatalogueCookiePolicyDate < currentTimeInMillisecods) {
    router.use((req, res, next) => {
      const value = req.cookies[config.consentCookieName]
        ? JSON.parse(req.cookies[config.consentCookieName])
        : undefined;

      if (value && value.creationDate && (
        value.creationDate < config.buyingCatalogueCookiePolicyDate
      )) {
        cookiePolicyClear({ res, logger });
      }
      return next();
    });
  }
};
