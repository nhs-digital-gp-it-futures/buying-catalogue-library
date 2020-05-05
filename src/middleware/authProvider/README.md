# AuthProvider
This class encapsulates all the authentication behaviour required in the Buying Catalogue FE apps.

## How to use
Import the AuthProvider where the server is configured

```javascript
const { AuthProvider } = require('buying-catalogue-library');
```

Pass in a config object to the AuthProvider.

```javascript
  const authProvider = new AuthProvider(config);
  const app = new App(authProvider).createApp();
  app.use(config.baseUrl, routes(authProvider));
```

## Params required to be passed in via config
- oidcBaseUri
- oidcClientId
- oidcClientSecret
- appBaseUri
- baseUrl
- redisTls
- redisPass
- redisUrl
- redisPort
- cookieSecret
- maxCookieAge
- publicBrowseBaseUrl
