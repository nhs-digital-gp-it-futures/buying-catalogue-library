import { getData } from '../../apiProvider';

export const status = {
  healthy: {
    code: 200,
    message: 'Healthy',
  },
  degraded: {
    code: 200,
    message: 'Degraded',
  },
  unhealthy: {
    code: 503,
    message: 'Unhealthy',
  },
};

const getReadyStatus = async ({ dependencies, logger }) => {
  const dependenciesPromises = await dependencies.map(async (dependency) => {
    try {
      await getData({ endpoint: dependency.endpoint, logger });
      logger.info(`${dependency.name} is healthy`);
      return 'healthy';
    } catch (e) {
      if (dependency.critical) {
        logger.error(`critical dependency ${dependency.name} is unhealthy`);
        return 'unhealthy';
      }
      logger.warn(`${dependency.name} is degraded`);
      return 'degraded';
    }
  });

  const dependeciesHealthResponse = await Promise.all(dependenciesPromises);

  if (dependeciesHealthResponse.includes('unhealthy')) return status.unhealthy;

  if (dependeciesHealthResponse.includes('degraded')) return status.degraded;

  return status.healthy;
};

export const healthRoutes = ({ router, dependencies, logger }) => {
  router.get('/health/live', (req, res) => {
    const liveStatus = status.healthy;
    res.status(liveStatus.code).send(liveStatus.message);
  });

  router.get('/health/ready', async (req, res) => {
    logger.debug('navigating to health/ready page');
    const readyStatus = await getReadyStatus({ dependencies, logger });
    res.status(readyStatus.code).send(readyStatus.message);
  });
};
