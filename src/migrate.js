import fs from 'fs';
import path from 'path';
import fetch from './fetch.js';
import create from './create.js';
import publish from './publish.js';

const logFile = path.join('.', 'migrate.log');

export default async() => {
  const fetchGalleries = fetch();

  let gallery = { done: false };
  while (!gallery.done) {
    gallery = await fetchGalleries.next();

    if (gallery.value) {
      const createResponse = await create(gallery.value);
      const log = `${gallery.value.identifier}=${createResponse.id}`;
      await fs.appendFileSync(logFile, `${log}\n`);
      if (createResponse.visibility === 'public') {
        await publish(createResponse.id);
      }
    }
  }
};
