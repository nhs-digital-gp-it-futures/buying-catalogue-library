# healthRoutes
This function is used to import health check routes in your app. 
2 routes will be added. `health/live` and `health/ready` 
`health/live` - will just check if your app is running
`health/ready` - will check if all dependencies in your app are running

## How to use
Import the `healthRoutes` in your app top level routes

```javascript
import { healthRoutes } from 'buying-catalogue-library';
```

Then use this where your routes are configured

```javascript
healthRoutes({ router, dependencies, logger });
```

### params
`router` - the router from your app.
`dependencies` - a list of dependencies for your app. See the test for example of this.
`logger` - the logger from your app.
