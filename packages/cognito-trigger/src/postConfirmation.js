const log = require('@wls/log');
const { UserService } = require('@wls/user-service');
const { createNeededResources } = require('./utils');

const DEFAULT_SIGNUP_GROUP = 'participants';

async function handler(event) {
  log.debug('Custom message handler triggered for event:', event);

  const {
    userPoolId,
    region,
    triggerSource,
    request: { userAttributes },
  } = event;
  const cognitoId = userAttributes.sub;
  const { email } = userAttributes;

  if (triggerSource !== 'PostConfirmation_ConfirmSignUp') {
    return event;
  }

  await createNeededResources(cognitoId);
  const userService = new UserService({
    userPoolId,
    region,
  });
  await userService.addUserToGroup(email, DEFAULT_SIGNUP_GROUP);

  // Return to Amazon Cognito
  return event;
}

module.exports = { handler };
