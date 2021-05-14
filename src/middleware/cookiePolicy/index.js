export const cookiePolicy = ({ res, logger }) => {
    res.cookie('gdpr', 'true', { maxAge: 360000 });
    logger.info(' creating cookie-policy cookie');
};
