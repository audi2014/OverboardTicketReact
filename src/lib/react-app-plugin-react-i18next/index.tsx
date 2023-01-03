import { createInstance, i18n as i18nType } from 'i18next';
import { TypesBasePlugin } from 'lib/react-app-plugin/types';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

export type PluginTypes = TypesBasePlugin<
  {
    init: (i18n: i18nType) => void;
  },
  {
    i18n: i18nType;
  }
>;

export const ReactAppPluginReactI18next: PluginTypes['Plugin'] = (
  config,
): PluginTypes['PluginModule'] => {
  const exports = {
    // https://github.com/i18next/react-i18next/blob/master/example/react-component-lib/src/other-lib/i18n.js
    i18n: createInstance(),
  };

  const build: PluginTypes['InstanceBuilder'] = () => {
    const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
      return <I18nextProvider i18n={exports.i18n}>{children}</I18nextProvider>;
    };
    const injections: PluginTypes['AppInjections'] = {
      onDidMountAsyncRace: [],
      onDidMountAsyncSequence: [],
      onDidMountSync: [],
      onInit: [
        {
          name: 'i18next-createInstance',
          call: () => config.init(exports.i18n),
        },
      ],
      onWillUnmount: [],
      wrappers: [Wrapper],
    };
    return {
      exports,
      injections,
    };
  };

  return {
    name: 'react-app-plugin-react-i18next',
    version: '0.0.0',
    requireBeforeBuild: [],
    build,
  };
};
