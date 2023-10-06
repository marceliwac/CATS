const knexfile = require('@cats/knexfile');

module.exports = knexfile.DANGEROUSLY_getKnexfile(
  process.env.DATABASE_SECRET_NAME
);
