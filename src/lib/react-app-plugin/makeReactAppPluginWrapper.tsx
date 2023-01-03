import React, { useEffect } from 'react';

import { defaultLogger } from './defaultLogger';
import { defaultResolver } from './defaultResolver';
import { runRace, runSequence, runSync } from './taskRunners';
import { PluginWrapperBuilder } from './typesWrapper';

const debugRoot = 'makeReactAppPluginWrapper';
const debugEffect = `${debugRoot}.IntegrationsWrapper.useEffect`;

export const makeReactAppPluginWrapper: PluginWrapperBuilder = (options = {}) => {
  const { plugins = [], resolver = defaultResolver, logger = defaultLogger } = options;
  const {
    injections: {
      wrappers,
      onInit,
      onDidMountSync,
      onDidMountAsyncRace,
      onDidMountAsyncSequence,
      onWillUnmount,
    },
  } = resolver(plugins);
  runSync(onInit, `${debugRoot}.onInit`, logger);
  const IntegrationsWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    useEffect(() => {
      (async () => {
        runSync(onDidMountSync, `${debugEffect}.onDidMountSync`, logger);
        await runRace(onDidMountAsyncRace, `${debugEffect}.onDidMountAsyncRace`, logger);
        await runSequence(
          onDidMountAsyncSequence,
          `${debugEffect}.onDidMountAsyncSequence`,
          logger,
        );
      })().catch((e) => logger.onTaskError(`${debugEffect}`, e));

      return () => {
        runSync(onWillUnmount, `${debugEffect}.onWillUnmount`, logger);
      };
    }, []);

    return wrappers
      .reverse()
      .reduce((prev, Component) => <Component>{prev}</Component>, <>{children}</>);
  };
  return IntegrationsWrapper;
};
