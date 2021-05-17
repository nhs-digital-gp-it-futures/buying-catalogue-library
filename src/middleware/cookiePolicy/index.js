const cookieName = 'buyingcatalogue-cookie-consent';

export const cookiePolicyAgreed = ({ res, logger }) => {
  res.cookie(cookieName, 'true', { maxAge: 360000 });
  logger.info(' creating cookie-policy cookie');
};

export const cookiePolicyClear = ({ res, logger }) => {
  res.clearCookie(cookieName);
  logger.info('clear cookie-policy cookie');
};
