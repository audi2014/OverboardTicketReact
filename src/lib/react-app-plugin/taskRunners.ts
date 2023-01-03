import { AsyncTask, Logger, SyncTask } from './typesUtils';

export const runSync = <DEBUG>(tasks: SyncTask[], debug: DEBUG, logger: Logger) => {
  for (const t of tasks) {
    try {
      t.call();
      logger.onTaskFinished(debug, t.name);
    } catch (e) {
      logger.onTaskError(debug, t.name, e);
    }
  }
};

export const runRace = <DEBUG>(tasks: AsyncTask[], debug: DEBUG, logger: Logger) => {
  const promises = tasks.map((t) =>
    t
      .call()
      .then(() => logger.onTaskFinished(debug, t.name))
      .catch((e) => logger.onTaskError(debug, t.name, e)),
  );
  return Promise.all(promises).catch((e) => logger.onTaskError(debug, e));
};

export const runSequence = async <DEBUG>(
  tasks: AsyncTask[],
  debug: DEBUG,
  logger: Logger,
) => {
  for (const t of tasks) {
    try {
      await t.call();
      logger.onTaskFinished(debug, t.name);
    } catch (e) {
      logger.onTaskError(debug, t.name, e);
    }
  }
};
