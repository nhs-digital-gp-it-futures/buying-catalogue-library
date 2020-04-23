export const errorHandler = (router, callback) => {
    router.use((error, req, res, next) => {
        if (error) {
            callback(error, req, res);
        }
        return next();
    });
};
