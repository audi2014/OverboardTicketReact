/* eslint-disable no-undef */
import { getEntryWithPlurals } from '../utils.js';

describe('utils', () => {
  it('getEntryWithPlurals', () => {
    expect(getEntryWithPlurals('', 'a.b')).toEqual(undefined);
    expect(
      getEntryWithPlurals(
        {
          a: 1,
          a_error: 2,
          a_many: 3,
        },
        'a',
      ),
    ).toEqual({
      a: 1,
      a_many: 3,
    });
  });
});
