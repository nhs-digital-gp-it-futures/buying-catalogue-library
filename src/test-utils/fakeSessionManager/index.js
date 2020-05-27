export const fakeSessionManager = () => ({
  saveToSession: () => {},
  getFromSession: ({ req, key }) => {
    if (req.cookies && req.cookies[key]) {
      try {
        return JSON.parse(req.cookies[key]);
      } catch (err) {
        return req.cookies[key];
      }
    }
    return undefined;
  },
});
