const errorRoutes = require('./src/error/errorRoutes');
const FakeAuthProvider = require('./src/fakeAuthProvider');

const library = {
  FakeAuthProvider,
  errorRoutes,
};

module.exports = library;
