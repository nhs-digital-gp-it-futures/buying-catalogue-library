const cookieName = 'buyingcatalogue-cookie-consent';

export const cookiePolicyAgreed = ({ res, logger }) => {
  const millisecondsInOneYear = 31556926000;
  const cookieData = {
    cookieValue: true,
    creationDate: new Date().getTime(),
  };
  res.cookie(cookieName, `${JSON.stringify(cookieData)}`, { maxAge: millisecondsInOneYear });

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
