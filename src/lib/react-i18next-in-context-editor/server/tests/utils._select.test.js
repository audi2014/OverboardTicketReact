/* eslint-disable no-undef */
import { select } from '../utils.js';

describe('utils', () => {
  it('select', () => {
    const root = {
      a: {
        b: {
          c: 1,
        },
      },
    };
    expect(select(root, 'a.b.c')).toEqual(1);
    expect(select(root, 'a.b')).toEqual({
      c: 1,
    });
    expect(select(root, 'a')).toEqual({
      b: {
        c: 1,
      },
    });
    expect(select(root, '')).toEqual(undefined);
    expect(select(root, 'b.c')).toEqual(undefined);
  });
});
