import React, { useEffect } from 'react';

import { runRace, runSequence, runSync } from './taskRunners';
import { AsyncTask, SyncTask } from './types';

export type Options = {
  onDidMountSync?: SyncTask[];
  onDidMountAsyncRace?: AsyncTask[];
  onDidMountAsyncSequence?: AsyncTask[];
  onWillUnmount?: SyncTask[];
};

export const makeBootstrapWrapper = ({
  onDidMountSync = [],
  onDidMountAsyncRace = [],
  onDidMountAsyncSequence = [],
  onWillUnmount = [],
}: Options = {}) => {
  const IntegrationsWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    useEffect(() => {
      (async () => {
        runSync(onDidMountSync, 'tasksOnDidMountSync');
        await runRace(onDidMountAsyncRace, 'tasksOnDidMountAsyncRace');
        await runSequence(onDidMountAsyncSequence, 'tasksOnDidMountAsyncSequence');
      })().catch((e) => console.error('IntegrationsWrapper', e));

      return () => {
        runSync(onWillUnmount, 'tasksOnWillUnmount');
      };
    }, []);
    return <>{children}</>;
  };
  return IntegrationsWrapper;
};
