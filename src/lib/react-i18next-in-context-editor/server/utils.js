const PLURALS = ['zero', 'singular', 'two', 'few', 'many', 'other'];

export const select = (obj, path) => {
  if (!obj || typeof obj !== 'object') return undefined;
  const keys = path.split('.');
  let value = obj;
  for (const key of keys) {
    const isLastKey = key === keys[keys.length - 1];
    if (isLastKey) {
      return value[key];
    } else {
      value = value[key];
      if (!value) return undefined;
    }
  }
};

export const getEntryWithPlurals = (obj, key) => {
  if (!obj || typeof obj !== 'object') return undefined;
  const keys = [key, ...PLURALS.map((p) => `${key}_${p}`)];
  const result = {};
  for (const k of keys) {
    if (obj[k]) {
      result[k] = obj[k];
    }
  }
  return result;
};

export const patchByPath = (obj, path, patch) => {
  if (path.includes('.')) {
    obj = select(obj, path);
  }
  if (!obj || typeof obj !== 'object') return undefined;
  Object.assign(obj, patch);
};
