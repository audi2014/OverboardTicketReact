import { EventBuss } from 'lib/react-app-plugin/impl/EventBuss';
import { Observable } from 'lib/react-app-plugin/impl/Observable';
import {
  PluginInitParamsType,
  PluginInterface,
} from 'lib/react-app-plugin/types/PluginInterface';

import { PersistControllerWeb } from './impl/PersistControllerWeb';
import { SerializerJson } from './impl/SerializerJson';
import { WebStorage } from './impl/WebStorage';
import { wrapperBuilderGuarded } from './impl/wrapperBuilderGuarded';
import { ConstructorParamsType, PersistPluginType } from './types';

export const VERSION = '0.0.0';
export const REQUIRE_BEFORE_INIT = undefined;

export class ReactAppPluginPersist implements PluginInterface, PersistPluginType {
  readonly version = VERSION;
  readonly requireBeforeInit = REQUIRE_BEFORE_INIT;

  readonly config: PersistPluginType['config'];
  readonly stateController: PersistPluginType['stateController'];
  readonly storage: PersistPluginType['storage'];
  readonly serializer: PersistPluginType['serializer'];
  readonly persistController: PersistPluginType['persistController'];
  readonly wrapperBuilder: PersistPluginType['wrapperBuilder'];
  readonly isStarted: PersistPluginType['isStarted'];

  constructor(params: ConstructorParamsType) {
    this.config = params.config;
    this.stateController = params.stateController;
    this.storage = params.storage ?? new WebStorage();
    this.serializer = params.serializer ?? new SerializerJson();
    this.persistController = params.persistController ?? new PersistControllerWeb();
    this.wrapperBuilder = params.wrapperBuilder ?? wrapperBuilderGuarded;
    this.isStarted =
      params.isStarted ?? new Observable(false, 'isStarted', new EventBuss());
  }

  async init(params: PluginInitParamsType) {
    await this.persistController.init({
      config: this.config,
      storage: this.storage,
      serializer: this.serializer,
      stateController: this.stateController,
    });
    const onStart = () => {
      this.persistController.start().catch(console.error);
      this.persistController
        .load()
        .then(() => this.isStarted.publisher.setValue(true))
        .catch(console.error);
    };
    const onStop = () => {
      this.isStarted.publisher.setValue(false).catch(console.error);
      this.persistController.save().catch(console.error);
      this.persistController.stop().catch(console.error);
    };
    params.eventBuss.listener.on('componentDidMount', onStart);
    params.eventBuss.listener.on('componentWillUnmount', onStop);

    onStart();
    return {
      Wrapper: this.wrapperBuilder(params, this),
    };
  }
}
