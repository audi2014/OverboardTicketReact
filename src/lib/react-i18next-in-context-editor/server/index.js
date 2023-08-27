import http from 'http';
import url from 'url';

import { getResValue, patchResValue } from './endpoints.js';

const basePath =
  '/Users/apikosoftwareproperty773/Documents/OverboardTicketReact/public/locales';

const router = {
  getResValue,
  patchResValue,
};

http
  .createServer(async (req, res) => {
    try {
      res.setHeader(`Access-Control-Allow-Origin`, `*`);
      res.setHeader(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
      res.setHeader(`Access-Control-Allow-Headers`, `*`);
      if (!req.url.startsWith('/api')) {
        res.end();
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      const payload = req.body || url.parse(req.url, true).query?.json;
      const data = JSON.parse(payload);
      console.log(new Date(), data);
      const fn = router[data.route];
      if (!fn) throw new Error(`Invalid route "${data.route}"`);
      const result = await fn({ ...data, basePath });
      const json = JSON.stringify(result);
      res.write(json);
      res.end();
    } catch (error) {
      console.error(new Date(), error);
      res.write(JSON.stringify({ error: error.message }));
      res.end();
    }
  })
  .listen(3000, function () {
    console.log('server start at port 3000'); //the server object listens on port 3000
  });
