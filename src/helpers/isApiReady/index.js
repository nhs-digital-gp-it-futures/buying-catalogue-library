import util from 'util';
import { getData } from '../../apiProvider';

const setTimeoutPromise = util.promisify(setTimeout);

export const isApiReady = async ({
  attempt, pollDuration, apiName, apiHealthEndpoint, logger,
}) => {
  try {
    await getData({ endpoint: apiHealthEndpoint, logger });
    logger.info(`${apiName} is now ready`);
    return true;
  } catch (err) {
    const nextAttempt = attempt + 1;
    const nextPollDuration = nextAttempt * pollDuration;
    logger.warn(`${apiName} is not ready - will poll again in ${nextAttempt} seconds`);
    return setTimeoutPromise(nextPollDuration).then(() => isApiReady({
      attempt: nextAttempt, pollDuration, apiName, apiHealthEndpoint, logger,
    }));
  }
};
