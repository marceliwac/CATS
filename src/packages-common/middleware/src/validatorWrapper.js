const yup = require('yup');
const log = require('@cats/log');
const { HttpResponse } = require('micro-aws-lambda');
const ValidatorError = require('./errors/ValidatorError');
const handleMiddlewareError = require('./helpers/handleMiddlewareError');

function verifyUserBelongsToGroupWrapper(group) {
  // eslint-disable-next-line consistent-return
  return ({ event }) => {
    log.debug(
      `Verifying whether user belongs to the indicated group (${group}).`
    );
    let groups;
    try {
      groups = event.requestContext.authorizer.claims['cognito:groups'];
      // Ensure that groups parameter is parsed as comma-delimited list of groups, or treated as an
      // array when passed as an array.
      if (typeof groups === 'string') {
        groups = groups.split(',');
      }
    } catch (error) {
      return handleMiddlewareError({
        error,
        message: 'Failed to extract user groups from event payload!',
      });
    }

    if (!groups.includes(group)) {
      const message = `User does not belong to the required group to complete this request (user's groups: [${groups.join(
        ', '
      )}], required group: ${group}).`;

      log.debug(message);

      return HttpResponse.error({
        body: {
          message,
        },
        statusCode: 403,
      });
    }

    log.debug(
      'User successfully verified as member of group:',
      group,
      'based on JWT claims payload.'
    );
  };
}

function ensureYupSchema(schema) {
  if (!yup.isSchema(schema)) {
    throw new ValidatorError(
      'The object supplied as the validator schema is not a valid Yup schema.'
    );
  }
}

function validateQuery(schema) {
  return ({ event }) => {
    if (!event.queryStringParameters) {
      log.debug(
        'No query parameters present in the request path. Skipping validation.'
      );
      return;
    }
    log.debug(
      'Validating the query-string parameters to match the supplied schema.'
    );
    let parameters;
    try {
      parameters = schema.cast(event.queryStringParameters);
    } catch (error) {
      // eslint-disable-next-line consistent-return
      return handleMiddlewareError({
        error,
        message: 'Failed to cast parameters for query string validation!',
      });
    }
    // eslint-disable-next-line consistent-return
    return schema
      .validate(parameters)
      .then((valid) => {
        log.debug(
          'Query parameters match the expected schema! Parsed query parameters will be overwritten' +
            ' in the event.queryStringParameters object.\nQuery parameters:',
          valid
        );
        // eslint-disable-next-line no-param-reassign
        event.queryStringParameters = valid;
      })
      .catch((error) =>
        handleMiddlewareError({
          error,
          message: 'Query-string parameters validation failed!',
          httpResponseOptions: {
            statusCode: 400,
          },
        })
      );
  };
}

function validateBody(schema) {
  return ({ event }) => {
    log.debug('Validating the body to match the supplied schema.');
    return schema
      .validate(event.body, { stripUnknown: false })
      .then((valid) => {
        log.debug(
          'Body matches the expected schema! Validated body will be overwritten in ' +
            'the event.body object.\nBody:',
          valid
        );
        // eslint-disable-next-line no-param-reassign
        event.body = valid;
      })
      .catch((error) => {
        log.error(error);
        return handleMiddlewareError({
          error,
          message: 'Body validation failed!',
          httpResponseOptions: {
            statusCode: 400,
          },
        });
      });
  };
}

function validatePath(schema) {
  return ({ event }) => {
    log.debug('Validating the body to match the supplied schema.');
    return schema
      .validate(event.pathParameters)
      .then((valid) => {
        log.debug(
          'Path parameters match the expected schema! Validated path parameters will be overwritten in ' +
            'the event.pathParameters object.\nPath parameters:',
          valid
        );
        // eslint-disable-next-line no-param-reassign
        event.pathParameters = valid;
      })
      .catch((error) =>
        handleMiddlewareError({
          error,
          message: 'Path parameter validation failed!',
          httpResponseOptions: {
            statusCode: 400,
          },
        })
      );
  };
}

function validateResponse(schema) {
  return ({ shared }) => {
    log.debug(
      'Stripping the response body from the additional properties.',
      shared.body
    );
    // eslint-disable-next-line no-return-await
    if (!shared.body) {
      log.debug('Response body is not set. Skipping validation.');
      return;
    }
    // eslint-disable-next-line consistent-return
    return schema
      .validate(shared.body, { stripUnknown: true })
      .then((valid) => {
        log.debug(
          'Response body validated according to schema! Validated response body will overwrite ' +
            'the shared.body object.\n Response:',
          valid
        );
        // eslint-disable-next-line no-param-reassign
        shared.body = valid;
      })
      .catch((error) =>
        handleMiddlewareError({
          error,
          message:
            'An error has occurred while stripping request response from extra fields. The model ' +
            'did not validate correctly.',
          httpResponseOptions: {
            statusCode: 500,
          },
        })
      );
  };
}

function validatorWrapper(opts) {
  const validators = { before: [], after: [] };
  if (opts) {
    if (Object.prototype.hasOwnProperty.call(opts, 'group')) {
      if (typeof opts.group !== 'string') {
        throw new ValidatorError('The group specifier needs to be a string!');
      }
      validators.before.push(verifyUserBelongsToGroupWrapper(opts.group));
    }
    if (Object.prototype.hasOwnProperty.call(opts, 'validators')) {
      if (Object.prototype.hasOwnProperty.call(opts.validators, 'query')) {
        ensureYupSchema(opts.validators.query);
        validators.before.push(validateQuery(opts.validators.query));
      }
      if (Object.prototype.hasOwnProperty.call(opts.validators, 'path')) {
        ensureYupSchema(opts.validators.path);
        validators.before.push(validatePath(opts.validators.path));
      }
      if (Object.prototype.hasOwnProperty.call(opts.validators, 'body')) {
        ensureYupSchema(opts.validators.body);
        validators.before.push(validateBody(opts.validators.body));
      }
      if (Object.prototype.hasOwnProperty.call(opts.validators, 'response')) {
        ensureYupSchema(opts.validators.response);
        validators.after.push(validateResponse(opts.validators.response));
      }
    }
  }
  return validators;
}

module.exports = validatorWrapper;
