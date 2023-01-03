import {
  PluginInterface,
  ReactComponentWrapperType,
} from 'lib/react-app-plugin/types/PluginInterface';
import { Provider } from 'react-redux';
import { Store } from 'redux';

export const VERSION = '0.0.0';
export const REQUIRE_BEFORE_INIT = undefined;

export class ReactAppPluginRedux implements PluginInterface {
  readonly requireBeforeInit = REQUIRE_BEFORE_INIT;
  readonly version = VERSION;

  constructor(readonly store: Store) {}

  async init() {
    const Wrapper: ReactComponentWrapperType = ({ children }) => {
      return <Provider store={this.store}>{children}</Provider>;
    };
    return { Wrapper };
  }
}
