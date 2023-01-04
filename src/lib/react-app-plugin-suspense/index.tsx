import {
  PluginInterface,
  ReactComponentWrapperType,
} from 'lib/react-app-plugin/types/PluginInterface';
import React from 'react';

export const VERSION = '0.0.0';
export const REQUIRE_BEFORE_INIT = undefined;

export class ReactAppPluginSuspense implements PluginInterface {
  readonly requireBeforeInit = REQUIRE_BEFORE_INIT;
  readonly version = VERSION;

  constructor(
    readonly fallback?: React.ReactNode,
    readonly Fallback?: React.ComponentType,
  ) {}

  async init() {
    const Wrapper: ReactComponentWrapperType = ({ children }) => (
      <React.Suspense fallback={this.Fallback ? <this.Fallback /> : this.fallback}>
        {children}
      </React.Suspense>
    );
    return {
      Wrapper,
    };
  }
}
