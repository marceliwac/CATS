const path = require('path');

module.exports = {
  style: {
    sass: {
      loaderOptions: {
        sassOptions: {
          includePaths: [path.join(__dirname, 'src', 'styles')],
        },
        additionalData: '@import "global.scss";',
      },
    },
  },
};
