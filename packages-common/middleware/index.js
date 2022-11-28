const yup = require('yup');

const customYup = {
  ...yup,
  customValidators: {
    guid: () =>
      yup
        .string()
        .matches(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        ),
  },
};

module.exports = {
  lambda: require('./src/lambda'),
  yup: customYup,
};
