import {
  PluginInitParamsType,
  PluginInterface,
} from 'lib/react-app-plugin/types/PluginInterface';
import { WrapperPropsType } from 'lib/react-app-plugin/types/WrapperHocType';
import React from 'react';
import ReactDOM from 'react-dom/client';

export const VERSION = '0.0.0';
export const REQUIRE_BEFORE_INIT = undefined;

export type ConstructorParamsType = WrapperPropsType & {
  strictMode?: boolean;
} & (
    | {
        element: HTMLElement;
      }
    | {
        elementId: string;
      }
  );

export class ReactAppPluginDom implements PluginInterface {
  readonly requireBeforeInit = REQUIRE_BEFORE_INIT;
  readonly version = VERSION;

  constructor(readonly constructorParams: ConstructorParamsType) {}

  async init({ Wrapper }: PluginInitParamsType) {
    const { strictMode, Loader, loader, App } = this.constructorParams;

    const element =
      'element' in this.constructorParams
        ? this.constructorParams.element
        : (document.getElementById(this.constructorParams.elementId) as HTMLElement);

    const root = ReactDOM.createRoot(element);

    const StrictWrapper = strictMode ? React.StrictMode : React.Fragment;

    root.render(
      <StrictWrapper>
        <Wrapper Loader={Loader} loader={loader} App={App} />
      </StrictWrapper>,
    );
  }
}
