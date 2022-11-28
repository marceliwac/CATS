module.exports = {
  GROUPS: ['administrators', 'participants'],
  WHITELISTED_ATTRIBUTES: {
    given_name: 'givenName',
    email_verified: 'isEmailVerified',
    family_name: 'familyName',
    email: 'email',
  },
  // https://docs.aws.amazon.com/cognito/latest/developerguide/limits.html
  COGNITO_DISABLE_USER_QUOTA: 25,
  COGNITO_ENABLE_USER_QUOTA: 25,
};
