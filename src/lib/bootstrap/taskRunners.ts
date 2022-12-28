import { AsyncTask, SyncTask } from './types';

export const runSync = <DEBUG>(tasks: SyncTask[], debug: DEBUG) => {
  for (const t of tasks) {
    try {
      t.call();
    } catch (e) {
      console.error(debug, t.name, e);
    }
  }
};

export const runRace = <DEBUG>(tasks: AsyncTask[], debug: DEBUG) => {
  const promises = tasks.map((t) =>
    t.call().catch((e) => console.error(debug, t.name, e)),
  );
  return Promise.all(promises).catch((e) => console.error(debug, e));
};

export const runSequence = async <DEBUG>(tasks: AsyncTask[], debug: DEBUG) => {
  for (const t of tasks) {
    try {
      await t.call();
    } catch (e) {
      console.error(debug, t.name, e);
    }
  }
};
