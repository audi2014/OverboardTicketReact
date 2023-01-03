import { StorageInterface } from '../types/StorageInterface';

export class WebStorage implements StorageInterface {
  constructor(readonly localStorage = window.localStorage) {}

  async getItem(key: string) {
    return this.localStorage.getItem(key);
  }

  async removeItem(key: string) {
    return this.localStorage.removeItem(key);
  }

  async setItem(key: string, item: string) {
    return this.localStorage.setItem(key, item);
  }
}
