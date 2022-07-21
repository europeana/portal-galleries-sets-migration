import fs from 'fs';
import path from 'path';
import fetch from './fetch.js';
import create from './create.js';
import publish from './publish.js';

const logFile = path.join('.', 'migrate.log');

export default async() => {
  const galleries = await fetch();

  for (const gallery of galleries) {
    const createResponse = await create(gallery);
    const log = `${gallery.identifier}=${createResponse.id}`;
    await fs.appendFileSync(logFile, `${log}\n`);
    await publish(createResponse.id);
  }
};
