/* eslint-disable no-undef */
import fs from 'fs';

import { patchResValue } from '../endpoints.js';

const dirname = process.cwd() + '/src/lib/react-i18next-in-context-editor/server';
const language = 'lng';
const ns = 'test.tmp';
const tmpPath = `${dirname}/${language}/${ns}.json`;
const content = {
  lvl1: 1,
  lvl12: {
    lvl2: 2,
    lvl22: {
      lvl3: 3,
    },
  },
};
describe('endpoints patchResValue', () => {
  beforeEach(() => {
    fs.writeFileSync(tmpPath, JSON.stringify(content, null, 2));
  });
  afterEach(() => {
    fs.unlinkSync(tmpPath);
  });
  it('patchResValue - empty path', async () => {
    await patchResValue({
      basePath: dirname,
      path: '',
      ns,
      language: language,
      patch: {
        lvl1: {
          itWasNumber: "but now it's an object",
        },
      },
    });

    expect(JSON.parse(fs.readFileSync(tmpPath))).toEqual({
      lvl1: {
        itWasNumber: "but now it's an object",
      },
      lvl12: {
        lvl2: 2,
        lvl22: {
          lvl3: 3,
        },
      },
    });
  });
  it('patchResValue - nested path', async () => {
    await patchResValue({
      basePath: dirname,
      path: 'lvl12.lvl22',
      ns,
      language: language,
      patch: {
        lvl3: {
          itWasNumber: "but now it's an object",
        },
        newKey: 'new value',
      },
    });

    expect(JSON.parse(fs.readFileSync(tmpPath))).toEqual({
      lvl1: 1,
      lvl12: {
        lvl2: 2,
        lvl22: {
          lvl3: {
            itWasNumber: "but now it's an object",
          },
          newKey: 'new value',
        },
      },
    });
  });
});
