# FakeAuthProvider
This class is used to mimic the behavior of the real AuthProvider in Buying Catalogue apps and is used for testing purposes only.

## How to use
Import the FakeAuthProvider in your app and where it is required

```javascript
import { FakeAuthProvider } from 'buying-catalogue-library';
```

Then pass in the FakeAuthProvider as a dependecy to your app and routes

```javascript
const authProvider = new FakeAuthProvider();
const app = new App(authProvider).createApp();
app.use('/', routes(authProvider));
```

## Where to use
The FakeAuthProvider is currently used when replicating the app for testing. This has been used in `testcafeRunner.js` and `routes.test`