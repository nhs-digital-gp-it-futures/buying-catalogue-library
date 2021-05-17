const cookieName = 'buyingcatalogue-cookie-consent';

export const cookiePolicyAgreed = ({ res, logger }) => {
  res.cookie(cookieName, 'true', { maxAge: 360000 });
  logger.info(`creating ${cookieName} cookie`);
};

export const cookiePolicyExists = ({ req, logger }) => {
  const value = req.cookies[cookieName];
  logger.info(`get ${cookieName} cookie, has value ${value}`);
};

export const cookiePolicyClear = ({ res, logger }) => {
  res.clearCookie(cookieName);
  logger.info(`clear ${cookieName} cookie`);
};
