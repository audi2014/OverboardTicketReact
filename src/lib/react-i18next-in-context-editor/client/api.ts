export const getResValue = (params: { path: string; ns: string; language?: string }) => {
  return fetch(
    `http://localhost:3000/api?json=${JSON.stringify({
      ...params,
      route: 'getResValue',
    })}`,
  ).then((res) => res.json() as Promise<Record<string, string>>);
};

export const patchResValue = (params: {
  path: string;
  ns: string;
  language?: string;
  patch: string | Record<string, unknown>;
}) => {
  return fetch(
    `http://localhost:3000/api?json=${JSON.stringify({
      ...params,
      route: 'patchResValue',
    })}`,
  ).then((res) => res.json());
};
