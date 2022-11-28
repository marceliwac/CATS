/*
 * Load global configuration file and run a script provided as argument with the variables set in
 * that file. Uses environment variable STAGE to select the correct stage from the config; if not
 * provided - the default will be used (development).
 */

const { execSync } = require('child_process');
const config = require('../configuration');

const env = Object.create(process.env);

const key = process.argv.slice(2, 3).join(' ');
const command = process.argv.slice(3).join(' ');

let stage = process.env.STAGE ? process.env.STAGE : 'development';
const environment = {
  ...config.stage[stage][key],
  STAGE: stage,
};

Object.keys(environment).forEach((key) => {
  if (process.env[key]) {
    env[key] = process.env[key];
  } else {
    env[key] = environment[key];
  }
});

execSync(command, { env, stdio: 'inherit' });
