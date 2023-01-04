import {
  PluginInitParamsType,
  PluginInterface,
  ReactComponentWrapperType,
} from 'lib/react-app-plugin/types/PluginInterface';
import { Provider } from 'react-redux';
import { Store } from 'redux';

export const VERSION = '0.0.0';
export const REQUIRE_BEFORE_INIT = undefined;

export type PreloadedStateType = { [key: string]: unknown } | undefined;
export type GetPreloadedStateType = () => Promise<PreloadedStateType>;
export type PreloadedStateProviderInterface = {
  getPreloadedState: GetPreloadedStateType;
};
export type CreateStoreParamsType = { preloadedState?: PreloadedStateType };
export type StoreBuilderType = (params: CreateStoreParamsType) => Promise<Store>;

export type ConstructorParamsType<PSP> =
  | {
      store: Store;
    }
  | {
      createStore: StoreBuilderType;
      preloadedStateProvider?: PreloadedStateProviderInterface;
      PreloadedStateProvider?: PSP;
    };

export class ReactAppPluginRedux<
  PSP extends new (...args: never[]) => PreloadedStateProviderInterface,
> implements PluginInterface
{
  readonly requireBeforeInit = REQUIRE_BEFORE_INIT;
  readonly version = VERSION;
  store: Store | undefined = undefined;

  constructor(readonly constructorParams: ConstructorParamsType<PSP>) {}

  async init({ container }: PluginInitParamsType) {
    let createdStore: Store;
    if ('store' in this.constructorParams) {
      createdStore = this.constructorParams.store;
    } else {
      let preloadedStateProvider: PreloadedStateProviderInterface | undefined;
      if (this.constructorParams.preloadedStateProvider) {
        preloadedStateProvider = this.constructorParams.preloadedStateProvider;
      } else if (this.constructorParams.PreloadedStateProvider) {
        preloadedStateProvider = container.get(
          this.constructorParams.PreloadedStateProvider,
        );
      }
      const preloadedState =
        preloadedStateProvider && (await preloadedStateProvider.getPreloadedState());
      createdStore = await this.constructorParams.createStore({ preloadedState });
    }
    this.store = createdStore;

    const Wrapper: ReactComponentWrapperType = ({ children }) => {
      return <Provider store={createdStore}>{children}</Provider>;
    };
    return { Wrapper };
  }
}
