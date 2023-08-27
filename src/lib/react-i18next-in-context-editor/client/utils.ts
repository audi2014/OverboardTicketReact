export const parseNsKey = (
  nsKey: string,
  nsSeparator = ':',
  keySeparator = '.',
  fallBackNs?: string | string[],
) => {
  const [nsOfKey, path] = nsKey.includes(':') ? nsKey.split(nsSeparator) : ['', nsKey];
  const key = path.split('.').pop() || '';
  const pathWithoutKey = path.split('.').slice(0, -1).join('.');

  const selectedNs = nsOfKey || fallBackNs;
  const ns = String(Array.isArray(selectedNs) ? selectedNs[0] : selectedNs);
  return {
    ns,
    path,
    key,
    pathWithoutKey,
  };
};
