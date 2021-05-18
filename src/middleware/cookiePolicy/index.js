const cookieName = 'buyingcatalogue-cookie-consent';

export const cookiePolicyAgreed = ({ res, logger }) => {
  const millisecondsInOneYear = 31556926000;
  res.cookie(cookieName, 'true', { maxAge: millisecondsInOneYear });
  logger.info(`creating ${cookieName} cookie`);
};

export const cookiePolicyExists = ({ req, logger }) => {
  const value = req.cookies[cookieName];
  logger.info(`get ${cookieName} cookie, has value ${value}`);
  return value !== undefined;
};

export const cookiePolicyClear = ({ res, logger }) => {
  res.clearCookie(cookieName);
  logger.info(`clear ${cookieName} cookie`);
};
