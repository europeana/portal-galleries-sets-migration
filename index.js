import listModule from './src/list.js';

const gallery = {
  list: listModule
};

const act = async(scope, action, args) => {
  if (scope === 'gallery' && gallery[action]) {
    return await gallery[action].cli(args);
  }

  console.log(`Unknown action: ${scope} ${action}`);
  process.exit(1);
};

const scope = process.argv[2];
const action = process.argv[3];
act(scope, action, process.argv.slice(4));
