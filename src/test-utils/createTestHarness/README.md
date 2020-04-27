# createTestHarness
This function will create a test harness that will mount a nunjuck component to a route and app so it can be unit tested.

## How to use
In your app create a `componentTester.js` file in a `test-utils` folder.

Copy to following code into `componentTester.js`
```javascript
import nunjucks from 'nunjucks';
import { createTestHarness } from 'buying-catalogue-library';
import { App } from '../app';
import config from '../config';

export const componentTester = (setup, callback) => (done) => {
  const app = new App().createApp();

  callback(createTestHarness({
    app,
    templateEngine: nunjucks,
    config,
    setup,
    done,
  }));
};
```

### Example of testing a nunjuck template
Below is an example of how to use the above `componentTester` to unit test your nunjuck template.

```javascript
import { componentTester } from '../test-utils/componentTester';

const setup = {
  template: {
    path: 'includes/header.njk',
  },
};

  it('should render the header banner', componentTester(setup, (harness) => {
    const context = {};

    harness.request(context, ($) => {
      const headerBanner = $('header[data-test-id="header-banner"]');
      expect(headerBanner.length).toEqual(1);
    });
  }));
```

### Example of testing a nunjuck component
Below is an example of how to use the above `componentTester` to unit test your nunjuck component.
```javascript
import { componentTester } from '../test-utils/componentTester';

const setup = {
  component: {
    name: 'generalPageDescription',
    path: 'components/general-page-description.njk',
  },
};

  it('should render the title if provided', componentTester(setup, (harness) => {
    const context = {
      params: {
        titleText: 'a title',
      },
    };

    harness.request(context, ($) => {
      const title = $('[data-test-id="general-page-title"]');
      expect(title.length).toEqual(1);
      expect(title.text().trim()).toEqual('a title');
    });
  }));
```