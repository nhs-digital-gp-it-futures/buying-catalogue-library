/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import request from 'supertest';
import cheerio from 'cheerio';

const addConfig = ({ context, config }) => ({
  ...context,
  config: {
    ...config,
    ...context.config,
  },
});

export const createTestHarness = ({
  app, templateEngine, config, setup, done,
}) => {
  const router = express.Router();

  return {
    request: (context, callback) => {
      const dummyRouter = router.get('/', (req, res) => {
        if (setup.template) {
          res.render(setup.template.path, addConfig({ context, config }));
        } else {
          const macroWrapper = setup.component ? `{% from '${setup.component.path}' import ${setup.component.name} %}
                                                    {{ ${setup.component.name}(params) }}` : '';

          const viewToTest = templateEngine.renderString(macroWrapper, addConfig({ context }));
          res.send(viewToTest);
        }
      });
      app.use(dummyRouter);

      request(app).get('/').then((response) => {
        callback(cheerio.load(response.text));
        done();
      });
    },
  };
};
