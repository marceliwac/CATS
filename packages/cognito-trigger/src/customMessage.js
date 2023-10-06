const log = require('@cats/log');

class CustomMessage {
  constructor(kwargs) {
    Object.assign(this, kwargs);
    const codeLinkFragment = `email=${this.usernameParameter}&code=${this.codeParameter}`;
    const userAttributeCodeLinkFragment = `email=${this.userAttributes.email}&code=${this.codeParameter}`;

    const resetPasswordBareLink = `${this.domainName}/account/resetPassword`;
    const resetPasswordLink = `${resetPasswordBareLink}?${userAttributeCodeLinkFragment}`;
    const completeSignupBareLink = `${this.domainName}/account/completeSignup`;
    const completeSignupLink = `${completeSignupBareLink}?${codeLinkFragment}`;
    const completeManualSignupBareLink = `${this.domainName}/account/completeManualSignup`;
    const completeManualSignupLink = `${completeManualSignupBareLink}?${userAttributeCodeLinkFragment}`;
    const verifyContactDetailsBareLink = `${this.domainName}/account/verifyContactDetails`;
    const verifyContactDetailsLink = `${verifyContactDetailsBareLink}?${userAttributeCodeLinkFragment}`;

    let headerName = 'User';
    let userAttributesFragment = '';
    if (this.userAttributes) {
      if (this.userAttributes.given_name) {
        headerName = this.userAttributes.given_name;
        userAttributesFragment += `&firstName=${this.userAttributes.given_name}`;
      }
      if (this.userAttributes.family_name) {
        userAttributesFragment += `&lastName=${this.userAttributes.family_name}`;
      }
    }

    this.headerName = headerName;
    this.signature = `<b>Sincerely<br/>Yourfirsname Yourlastname<br/><br/></b><em>For any help regarding this study please contact me directly at: youremailaddress@xxxxxxxxx.com</em>`;

    this.completeSignupBareLink = completeSignupBareLink;
    this.completeManualSignupBareLink = completeManualSignupBareLink;
    this.verifyContactDetailsBareLink = verifyContactDetailsBareLink;
    this.resetPasswordBareLink = resetPasswordBareLink;

    this.completeSignupLink = `${completeSignupLink}${userAttributesFragment}`;
    this.completeManualSignupLink = `${completeManualSignupLink}${userAttributesFragment}`;
    this.verifyContactDetailsLink = verifyContactDetailsLink;
    this.resetPasswordLink = resetPasswordLink;
  }

  sendAdminCreateUser() {
    const link = this.completeSignupLink;
    const bareLink = this.completeSignupBareLink;

    const group =
      this.clientMetadata &&
      typeof this.clientMetadata === 'object' &&
      Object.prototype.hasOwnProperty.call(this.clientMetadata, 'group') &&
      typeof this.clientMetadata.group === 'string'
        ? this.clientMetadata.group
        : null;

    const emailMessage = `<html lang="en">
      Dear ${this.headerName},
      <br />
      <br />
      You have been invited to sign-up for an account for ${
        this.applicationName
      }${group ? ` as one of the ${group}` : ''}. 
      To activate your account, you will need to set the new password and ensure that your name is entered correctly.
      <br />
      <br />
      You can complete your sign-up by clicking on the link below:
      <br />
      <br />
      <a href="${link}">Complete sign-up</a>
      <br />
      <br />
      Alternatively, you can complete your sign-up by visiting <a href="${bareLink}">${bareLink}</a> and using the following credentials:
      <br />
      <br />
      <b>E-mail (username):</b> ${this.usernameParameter}
      <br />
      <b>Password:</b> ${this.codeParameter}
      <br />
      <br />
      ${this.signature}
    </html>`;

    return {
      emailSubject: `Your new account for ${this.applicationName}.`,
      emailMessage,
    };
  }

  sendCodePostSignUp() {
    const link = this.completeManualSignupLink;
    const bareLink = this.completeManualSignupBareLink;
    return {
      emailSubject: `Validate your account for ${this.applicationName}.`,
      emailMessage: `<html lang="en">
          Dear ${this.headerName},
          <br />
          <br />
          Thank you for signing up.
          <br />
          You can complete your sign-up by clicking on the link below:
          <br />
          <br />
          <a href="${link}">Complete sign-up</a>
          <br />
          <br />
          Alternatively, you can complete your sign-up by visiting <a href="${bareLink}">${bareLink}</a> and using the following credentials:
          <br />
          <br />
          <b>E-mail (username):</b> ${this.userAttributes.email}
          <br />
          <b>Code:</b> ${this.codeParameter}
          <br />
          <br />
          ${this.signature}
        </html>`,
    };
  }

  sendCodeResetPassword() {
    const link = this.resetPasswordLink;
    const bareLink = this.resetPasswordBareLink;
    return {
      emailSubject: `Reset your password for ${this.applicationName}.`,
      emailMessage: `<html lang="en">
        Dear ${this.headerName},
        <br />
        <br />
        It appears that you have requested a password reset for your ${this.applicationName} account.
        <br />
        Please click on the link to reset your password:
        <br />
        <br />
          <a href="${link}">Reset password</a>
        <br />
        <br />
        Alternatively, you can reset your password by visiting <a href="${bareLink}">${bareLink}</a> and using the following verification code:
        <br />
        <b>E-mail (username):</b> ${this.userAttributes.email}
        <br />
        <b>Verification code:</b> ${this.codeParameter}
        <br />
        <br />
        ${this.signature}
      </html>`,
    };
  }

  sendUpdateUserAttribute() {
    const link = this.verifyContactDetailsLink;
    const bareLink = this.verifyContactDetailsBareLink;
    return {
      emailSubject: `Verify your new contact details for ${this.applicationName}.`,
      emailMessage: `<html lang="en">
        Dear ${this.headerName},
        <br />
        <br />
        It appears that you have requested a change in your contact details for your ${this.applicationName} account.
        <br />
        Please click on the link below to verify your updated contact details:
        <br />
        <br />
        <a href="${link}">Verify details</a>
        <br />
        <br />
        Alternatively, you can verify your contact details by visiting <a href="${bareLink}">${bareLink}</a> and using the following verification code:
        <br />
        <b>E-mail (username):</b> ${this.usernameParameter}
        <br />
        <b>Verification code:</b> ${this.codeParameter}
        <br />
        <br />
        ${this.signature}
      </html>`,
    };
  }

  // TODO: Refactor this.
  resendConfirmationCode() {
    const link = this.completeManualSignupLink;
    const bareLink = this.completeManualSignupBareLink;
    return {
      emailSubject: `Complete your sign-up for ${this.applicationName}.`,
      emailMessage: `<html lang="en">
        Dear ${this.headerName},
        <br />
        <br />
        This is a verification code reminder to complete the sign-up for your account at ${this.applicationName}.
        <br />
        Please click on the link to activate your account:
        <br />
        <br />
        <a href="${link}">Activate account</a>
        <br />
        <br />
        Alternatively, you can complete your sign-up by visiting <a href="${bareLink}">${bareLink}</a> and using the following verification code:
        <br />
        <b>E-mail (username):</b> ${this.usernameParameter}
        <br />
        <b>Verification code:</b> ${this.codeParameter}
        <br />
        <br />
        ${this.signature}
      </html>`,
    };
  }
}

function handler(event, context, callback) {
  log.debug('Custom message handler triggered for event:', event);
  const { WEBSITE_URL, APPLICATION_NAME } = process.env;
  const {
    triggerSource,
    request: {
      codeParameter,
      userAttributes,
      usernameParameter,
      clientMetadata,
    },
  } = event;

  const customMessage = new CustomMessage({
    domainName: WEBSITE_URL,
    applicationName: APPLICATION_NAME,
    userAttributes,
    usernameParameter,
    codeParameter,
    clientMetadata,
  });

  /* eslint-disable no-param-reassign */
  if (
    triggerSource === 'CustomMessage_SignUp' &&
    userAttributes['cognito:user_status'] === 'UNCONFIRMED'
  ) {
    event.response = customMessage.sendCodePostSignUp();
  } else if (triggerSource === 'CustomMessage_ForgotPassword') {
    event.response = customMessage.sendCodeResetPassword();
  } else if (triggerSource === 'CustomMessage_UpdateUserAttribute') {
    event.response = customMessage.sendUpdateUserAttribute();
  } else if (triggerSource === 'CustomMessage_AdminCreateUser') {
    event.response = customMessage.sendAdminCreateUser();
  } else if (triggerSource === 'CustomMessage_ResendCode') {
    event.response = customMessage.resendConfirmationCode();
  }

  // Return to Amazon Cognito
  callback(null, event);
}

module.exports = { handler };
