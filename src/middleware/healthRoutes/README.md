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

`dependencies` - an array of dependencies objects for your app. 
Exampe of non critical dependency
```javascript
{
  name: 'dependency name',
  endpoint: 'http://some-endpoint',
}
```

Exampe of critical dependency
```javascript
{
  name: 'dependency name',
  endpoint: 'http://some-endpoint',
  critical: true
}
```

If the dependency is critical for your app to run. Add the flag `critical: true`. This will return a status of `Unhealthy` if that dependency is not available.
Otherwise `Degraded` is returned.

`logger` - the logger from your app.
