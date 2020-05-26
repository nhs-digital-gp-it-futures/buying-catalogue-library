export const sessionManager = ({ logger }) => ({
  saveToSession: ({ req, key, value }) => {
    logger.debug(`Saving to session ${key} with value ${value}`);
    req.session[key] = value;
    logger.debug(`saved to session ${key} successfull`);
  },

  getFromSession: ({ req, key }) => {
    logger.debug(`Getting from session ${key}`);
    const valueFromSession = req.session[key];
    logger.debug(`Get from ${key} successfull`);
    return valueFromSession;
  },
});
