/* eslint-disable no-undef */

import { getResValue } from '../endpoints.js';
describe('endpoints getResValue', () => {
  it('getResValue', async () => {
    const dirname = process.cwd() + '/src/lib/react-i18next-in-context-editor/server';
    expect(
      await getResValue({
        basePath: dirname,
        path: 'ok',
        ns: 'test',
        language: 'lng',
      }),
    ).toEqual({ ok: 'ok default', ok_other: 'ok other' });

    expect(
      await getResValue({
        basePath: dirname,
        path: 'scope.ok',
        ns: 'test',
        language: 'lng',
      }),
    ).toEqual({
      ok: 'scope > ok default',
      ok_other: 'scope > ok other',
    });
  });
});
