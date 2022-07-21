import auth from './src/auth.js';
import clean from './src/clean.js';
import fetch from './src/fetch.js';
import migrate from './src/migrate.js';

const cli = {
  auth,
  clean,
  fetch,
  migrate
};

const act = async(scope, action, args) => {
  if (scope === 'gallery' && cli[action]) {
    try {
      const output = await cli[action](args);
      if (output) {
        console.log(JSON.stringify(output, null, 2));
      }
    } catch (e) {
      if (e.response) {
        console.error(e.response.status, e.response.data);
      } else {
        console.error(e.message);
      }
    }
  } else {
    console.error(`Unknown action: ${scope} ${action}`);
    process.exit(1);
  }
};

const scope = process.argv[2];
const action = process.argv[3];
act(scope, action, process.argv.slice(4));
