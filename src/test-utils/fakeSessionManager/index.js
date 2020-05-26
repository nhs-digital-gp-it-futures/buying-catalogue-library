export const fakeSessionManager = () => ({
  saveToSession: () => {},
  getFromSession: ({ req, key }) => {
    if (req.cookies && req.cookies[key]) {
      return JSON.parse(req.cookies[key]);
    }
    return undefined;
  },
});
