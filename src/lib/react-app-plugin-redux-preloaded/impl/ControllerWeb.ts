import { ExternalStateType } from 'lib/react-app-plugin-redux-preloaded/types';

import { ControllerInitParams, ControllerInterface } from '../types/ControllerInterface';

export class ControllerWeb implements ControllerInterface {
  protected context?: ControllerInitParams;

  async init(context: ControllerInitParams) {
    this.context = context;
  }

  async start() {
    window.addEventListener('beforeunload', this.save.bind(this));
  }

  async stop() {
    window.removeEventListener('beforeunload', this.save.bind(this));
  }

  async save() {
    if (!this.context) return;
    const reduxState = await this.context.getStateBeforeSave();
    const keys = this.context.config.whitelist || Object.keys(reduxState);
    const filteredKeys = this.context.config.blacklist
      ? keys.filter((k) => !this.context?.config.blacklist?.includes(k))
      : keys;

    const filteredState = filteredKeys.reduce((prev, key) => {
      prev[key] = reduxState[key];
      return prev;
    }, {} as Partial<ExternalStateType>);
    const string = await this.context.serializer.stringify(filteredState);
    await this.context.storage.setItem(this.context.config.key, string);
  }

  async load() {
    if (!this.context) return;
    const string = await this.context.storage.getItem(this.context.config.key);
    if (string) {
      return await this.context.serializer.parse(string);
    }
  }
}
