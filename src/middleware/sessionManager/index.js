export const sessionManager = ({ logger }) => ({
  saveToSession: ({ req, key, value }) => {
    logger.debug(`Saving to session ${key} with value ${value}`);
    req.session[key] = value;
    logger.debug(`Saved to session ${key} successful`);
  },

  getFromSession: ({ req, key }) => {
    logger.debug(`Getting from session ${key}`);
    const valueFromSession = req.session[key];
    logger.debug(`Get for ${key} successful`);
    return valueFromSession;
  },
});
