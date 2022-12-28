import { Resources } from './base/types';

export const getResources = async (locale: 'default' = 'default'): Promise<Resources> => {
  switch (locale) {
    default:
      return (await import('./base')).resources;
  }
};
