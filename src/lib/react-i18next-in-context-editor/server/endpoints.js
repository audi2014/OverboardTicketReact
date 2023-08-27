import fs from 'fs';
import util from 'util';

import { getEntryWithPlurals, patchByPath, select } from './utils.js';

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

export const getResValue = async ({
  basePath,
  path,
  ns,
  language = 'en',
  encoding = 'utf8',
}) => {
  const filePath = `${basePath}/${language}/${ns}.json`;
  const file = await readFileAsync(filePath, encoding);
  const json = JSON.parse(file);
  const pathParent = path.split('.').slice(0, -1).join('.');
  const key = path.split('.').pop();
  const obj = pathParent ? select(json, pathParent) : json;
  return getEntryWithPlurals(obj, key);
};

export const patchResValue = async ({
  basePath,
  path,
  ns,
  language = 'en',
  encoding = 'utf8',
  patch,
}) => {
  const filePath = `${basePath}/${language}/${ns}.json`;
  const file = await readFileAsync(filePath, encoding);
  const json = JSON.parse(file);
  patchByPath(json, path, patch);
  await writeFileAsync(filePath, JSON.stringify(json, null, 2), {
    encoding: 'utf8',
    flag: 'w',
  });
  return true;
};
