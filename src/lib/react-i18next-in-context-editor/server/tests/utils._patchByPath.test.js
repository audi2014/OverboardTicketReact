/* eslint-disable no-undef */
import { patchByPath } from '../utils.js';

describe('utils', () => {
  it('patchByPath', () => {
    const root = {
      a: {
        b: {
          c: 1,
        },
      },
    };
    patchByPath(root, 'a.b', {
      d: 2,
      e: 3,
    });
    expect(root).toEqual({
      a: {
        b: {
          c: 1,
          d: 2,
          e: 3,
        },
      },
    });
  });
});
