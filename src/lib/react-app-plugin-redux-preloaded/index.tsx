import { EventBuss } from 'lib/react-app-plugin/impl/EventBuss';
import { Observable } from 'lib/react-app-plugin/impl/Observable';
import {
  PluginInitParamsType,
  PluginInterface,
} from 'lib/react-app-plugin/types/PluginInterface';
import { PreloadedStateProviderInterface } from 'lib/react-app-plugin-redux';

import { ControllerWeb } from './impl/ControllerWeb';
import { SerializerJson } from './impl/SerializerJson';
import { WebStorage } from './impl/WebStorage';
import { ConstructorParamsType, PluginFieldsType } from './types';

export const VERSION = '0.0.0';
export const REQUIRE_BEFORE_INIT = undefined;

export class ReactAppPluginPreloadedState
  implements PluginInterface, PluginFieldsType, PreloadedStateProviderInterface
{
  readonly version = VERSION;
  readonly requireBeforeInit = REQUIRE_BEFORE_INIT;

  readonly config: PluginFieldsType['config'];
  readonly getStateBeforeSave: PluginFieldsType['getStateBeforeSave'];
  readonly storage: PluginFieldsType['storage'];
  readonly serializer: PluginFieldsType['serializer'];
  readonly controller: PluginFieldsType['controller'];
  readonly loaded: PluginFieldsType['loaded'];

  constructor(params: ConstructorParamsType) {
    this.getStateBeforeSave = params.getStateBeforeSave;
    this.config = params.config ?? { key: `${ReactAppPluginPreloadedState.name}` };
    this.storage = params.storage ?? new WebStorage();
    this.serializer = params.serializer ?? new SerializerJson();
    this.controller = params.controller ?? new ControllerWeb();
    this.loaded = params.loaded ?? new Observable(undefined, 'loaded', new EventBuss());
  }

  async init(params: PluginInitParamsType) {
    await this.controller.init(this);
    await this.controller
      .load()
      .then((preloadedState) => this.loaded.publisher.update(preloadedState));

    const onStart = () => {
      this.controller.start().catch(console.error);
    };
    const onStop = () => {
      this.controller.save().catch(console.error);
      this.controller.stop().catch(console.error);
    };
    params.eventBuss.listener.on('componentDidMount', onStart);
    params.eventBuss.listener.on('componentWillUnmount', onStop);

    onStart();
    return {};
  }

  async getPreloadedState() {
    return this.loaded.listener.getValue();
  }
}
