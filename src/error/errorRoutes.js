const getErrorContext = require('./controller');

const errorRoutes = (router) => {

    router.get('*', (req, res, next) => {
        const error = getErrorContext({
            status: 404,
            title: `Incorrect url ${req.originalUrl}`,
            description: 'Please check it is valid and try again',
        });
        next(error);
    });

    router.use((error, req, res, next) => {
        if (error) {
            const context = error;
            // logger.error(`${context.error.title} - ${context.error.description}`);
            return res.render('pages/error/template.njk', addContext({context, user: req.user}));
        }
        return next();
    });

};

module.exports = errorRoutes;
