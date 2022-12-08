import fs from 'fs';
import path from 'path';

import auth from './auth.js';
import publish from './publish.js';
import deleteSet from './delete.js';
import * as errors from './errors.js';

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
      let notFound = false;
      try {
        await publish(uri, 'unpublish');
      } catch (error) {
        if (errors.setNotFoundError(error)) {
          console.warn('WARN: set not found; skipping');
          notFound = true;
        } else if (errors.unpublishNotPublishedSetError(error)) {
          console.warn('WARN: set not published; skipping');
        } else {
          throw error;
        }
      }

      if (!notFound) {
        await deleteSet(uri);
      }
    }
  }

  await fs.truncateSync(logFile);
};
