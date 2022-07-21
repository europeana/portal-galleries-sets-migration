import fs from 'fs';
import path from 'path';

import auth from './auth.js';
import publish from './publish.js';
import deleteSet from './delete.js';

let accessToken;

const logFile = path.join('.', 'migrate.log');

export default async() => {
  if (!accessToken) {
    const authTokenResponse = await auth();
    accessToken = authTokenResponse['access_token'];
  }

  const logs = await fs.readFileSync(logFile, { encoding: 'utf8' }).split(/\r?\n/);
  for (const log of logs) {
    const uri = log.split('=')[1];
    if (uri) {
      await publish(uri, 'unpublish');
      await deleteSet(uri, 'unpublish');
    }
  }

  await fs.truncateSync(logFile);
};
