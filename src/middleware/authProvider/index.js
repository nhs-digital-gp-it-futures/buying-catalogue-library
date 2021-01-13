import passport from 'passport';
import { Strategy, Issuer } from 'openid-client';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';

export class AuthProvider {
  constructor({
    config, scopes, unauthenticatedError, logger,
  }) {
    this.passport = passport;
    this.config = config;
    this.unauthenticatedError = unauthenticatedError;
    this.logger = logger;

    Issuer.discover(this.config.oidcBaseUri)
      .then((issuer) => {
        this.client = new issuer.Client({
          client_id: this.config.oidcClientId,
          client_secret: this.config.oidcClientSecret,
        });

        const params = {
          client_id: this.config.oidcClientId,
          redirect_uri: `${this.config.appBaseUri}${this.config.baseUrl}/oauth/callback`,
          scope: `openid profile ${scopes}`,
        };

        const passReqToCallback = true;

        const usePKCE = 'S256';

        this.passport.use('oidc', new Strategy({
          client: this.client,
          params,
          passReqToCallback,
          usePKCE,
        },
        (req, tokenset, userinfo, done) => {
          req.session.accessToken = tokenset;

          return done(null, userinfo);
        }));
      });

    this.passport.serializeUser((user, done) => {
      done(null, user);
    });

    this.passport.deserializeUser((obj, done) => {
      done(null, obj);
    });
  }

  setup(app) {
    const RedisStore = connectRedis(session);
    const redisTlsConfig = this.config.redisTls === 'true'
      ? { auth_pass: this.config.redisPass, tls: { servername: this.config.redisUrl } }
      : undefined;
    const redisClient = redis.createClient(
      this.config.redisPort, this.config.redisUrl, redisTlsConfig,
    );

    app.use(session({
      store: new RedisStore({ client: redisClient }),
      name: 'token',
      secret: this.config.cookieSecret,
      resave: false,
      saveUninitialized: true,
      maxAge: this.config.maxCookieAge,
    }));

    app.use(this.passport.initialize());
    app.use(this.passport.session());
  }

  login() {
    return (req, res, next) => {
      const options = {
        state: new URL(req.headers.referer).pathname,
      };
      this.passport.authenticate('oidc', options)(req, res, next);
    };
  }

  loginCallback() {
    return (req, res, next) => {
      const redirectUrl = req.query.state;
      const optionsWithUrl = {
        callback: true,
        failureRedirect: '/',
        successReturnToOrRedirect: redirectUrl,
      };

      this.passport.authenticate('oidc', optionsWithUrl)(req, res, next);
    };
  }

  logout({ idToken }) {
    return this.client.endSessionUrl({
      id_token_hint: idToken,
      post_logout_redirect_uri: `${this.config.appBaseUri}${this.config.baseUrl}/signout-callback-oidc`,
    });
  }

  authorise({ claim } = {}) {
    return (req, res, next) => {
      if (!req.user) {
        this.logger.info('User not logged in');
        req.headers.referer = `${req.originalUrl}`;
        this.login()(req, res, next);
      } else if (req.user && claim && req.user[claim] && req.user[claim].toLowerCase() === 'manage') {
        this.logger.info('User is authorised');
        next();
      } else {
        this.logger.warn('User is not authorised');
        throw this.unauthenticatedError;
      }
    };
  }
}
