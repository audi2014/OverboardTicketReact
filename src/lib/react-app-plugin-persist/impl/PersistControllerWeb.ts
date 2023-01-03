import {
  PersistControllerInitParams,
  PersistControllerInterface,
} from '../types/PersistControllerInterface';

export class PersistControllerWeb implements PersistControllerInterface {
  protected context?: PersistControllerInitParams;

  async init(context: PersistControllerInitParams) {
    this.context = context;
  }

  async start() {
    window.addEventListener('beforeunload', this.save);
  }

  async stop() {
    window.removeEventListener('beforeunload', this.save);
  }

  async save() {
    if (!this.context) return;
    const state = await this.context.stateController.getState();
    const keys = this.context.config.whitelist || Object.keys(state);
    const filteredKeys = this.context.config.blacklist
      ? keys.filter((k) => !this.context?.config.blacklist?.includes(k))
      : keys;

    const persistedState = filteredKeys.reduce((prev, key) => {
      prev[key] = state[key];
      return prev;
    }, {} as Partial<typeof state>);
    const string = await this.context.serializer.stringify(persistedState);
    await this.context.storage.setItem(this.context.config.key, string);
  }

  async load() {
    if (!this.context) return;
    const string = await this.context.storage.getItem(this.context.config.key);
    if (string) {
      const state = await this.context.serializer.parse(string);
      await this.context.stateController.setState(state);
    }
  }
}
