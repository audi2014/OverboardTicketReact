import { createInstance } from 'i18next';
import {
  PluginInterface,
  ReactComponentWrapperType,
} from 'lib/react-app-plugin/types/PluginInterface';
import { I18nextProvider } from 'react-i18next';

export const VERSION = '0.0.0';
export const REQUIRE_BEFORE_INIT = undefined;

export class ReactAppPluginReactI18next implements PluginInterface {
  readonly requireBeforeInit = REQUIRE_BEFORE_INIT;
  readonly version = VERSION;

  constructor(
    // https://github.com/i18next/react-i18next/blob/master/example/react-component-lib/src/other-lib/i18n.js
    readonly i18n = createInstance(),
  ) {}

  async init() {
    const Wrapper: ReactComponentWrapperType = ({ children }) => {
      return <I18nextProvider i18n={this.i18n}>{children}</I18nextProvider>;
    };

    return { Wrapper };
  }
}
