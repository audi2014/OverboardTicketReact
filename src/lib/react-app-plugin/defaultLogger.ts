import { Logger } from './typesUtils';

export const defaultLogger: Logger = {
  onTaskFinished: (...args) => console.log('onTaskFinished', ...args),
  onTaskError: (...args) => console.error('onTaskError', ...args),
};
