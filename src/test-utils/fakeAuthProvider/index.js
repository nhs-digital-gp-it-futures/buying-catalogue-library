import { ErrorContext } from '../../models/errorContext';

export class FakeAuthProvider {
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(fakeLogoutMethod = () => {}) {
    this.fakeLogout = fakeLogoutMethod;
  }

  // eslint-disable-next-line class-methods-use-this
  setup(app) {
    app.use((req, res, next) => {
      if (req.cookies && req.cookies.fakeToken) {
        req.user = JSON.parse(req.cookies.fakeToken);
      }
      req.logout = this.fakeLogout;
      next();
    });
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  login() {
    return (req, res) => {
      res.redirect('http://identity-server/login');
    };
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  loginCallback() {
    return (req, res) => {
      res.redirect('/');
    };
  }

  // eslint-disable-next-line class-methods-use-this
  logout() {
    return '/signout-callback-oidc';
  }

  // eslint-disable-next-line class-methods-use-this
  authorise({ claim } = {}) {
    return (req, res, next) => {
      if (!req.user) {
        this.login()(req, res, next);
      } else if (req.user && claim && req.user[claim] && req.user[claim].toLowerCase() === 'manage') {
        next();
      } else {
        throw new ErrorContext({
          status: 401,
          description: 'You are not authorised to view this page',
          backLinkHref: '/',
          backLinkText: 'Back to home page',
        });
      }
    };
  }
}
