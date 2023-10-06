const log = require('@cats/log');
const { createNeededResources } = require('./utils');

async function handler(event) {
  log.debug('Custom message handler triggered for event:', event);

  const { triggerSource, userName: cognitoId } = event;

  if (triggerSource !== 'PreSignUp_AdminCreateUser') {
    return event;
  }

  await createNeededResources(cognitoId);

  // Return to Amazon Cognito
  return event;
}

module.exports = { handler };
