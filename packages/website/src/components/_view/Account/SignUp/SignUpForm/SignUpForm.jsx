import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Link } from 'react-router-dom';
import styles from '../SignUp.module.scss';
import FormTextField from '../../../Common/FormTextField/FormTextField';
import { equalValidator } from '../../../../../util/FormValidatorFunctions';
import FormCheckbox from '../../../Common/FormCheckbox/FormCheckbox';

const CONSENT_FORM_LINK = process.env.REACT_APP_CONSENT_FORM_LINK || '';

export default function SignUpForm() {
  const { getFieldState, getValues, trigger } = useFormContext();

  const passwordsMatchValidator = equalValidator(
    getValues,
    'password',
    'repeatPassword',
    'Passwords do not match.'
  );

  return (
    <>
      <div className={styles.horizontalInputs}>
        <FormTextField
          name="firstName"
          label="First name"
          autocomplete="given-name"
          rules={{
            required: { value: true, message: 'First name is required.' },
          }}
        />
        <FormTextField
          name="lastName"
          label="Last name"
          autocomplete="family-name"
          rules={{
            required: { value: true, message: 'Last name is required.' },
          }}
        />
      </div>
      <FormTextField
        name="email"
        label="E-mail address"
        autocomplete="email"
        rules={{
          required: { value: true, message: 'E-mail address is required.' },
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'E-mail address must be a valid e-mail.',
          },
        }}
      />
      <FormTextField
        name="password"
        label="Password"
        type="password"
        autocomplete="off"
        defaultHelperText="Password has to have at least 8 characters, including one number, one upper-case and one lower-case character."
        rules={{
          required: { value: true, message: 'Password is required.' },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}$/,
            message:
              'Password has to have at least 8 characters, including one number, one upper-case and one lower-case character.',
          },
          validate: {
            triggerRepeatPasswordValidation: () => {
              const repeatNewPasswordState = getFieldState('repeatPassword');
              if (repeatNewPasswordState && repeatNewPasswordState.isDirty) {
                trigger('repeatPassword');
              }
            },
          },
        }}
      />
      <FormTextField
        name="repeatPassword"
        label="Repeat password"
        type="password"
        autocomplete="off"
        rules={{
          required: { value: true, message: 'Password has to be repeated.' },
          validate: {
            passwordsMatchValidator,
          },
        }}
      />
      <FormCheckbox
        name="confirmConsentFormSignature"
        label="I have signed the consent form."
        autocomplete="off"
        rules={{
          required: {
            value: true,
            message:
              'You have to confirm that you have signed the consent form.',
          },
        }}
      />
      <FormCheckbox
        name="confirmConsentFormVerification"
        label="I have verified the consent form via e-mail link."
        autocomplete="off"
        rules={{
          required: {
            value: true,
            message:
              'You have to confirm that you have verified the consent form.',
          },
        }}
      />
      <p className={styles.warning}>
        It is <span className={styles.bold}>extremely important</span> that you
        both <span className={styles.bold}>sign</span> and{' '}
        <span className={styles.bold}>verify</span> the study{' '}
        <a href={CONSENT_FORM_LINK}>consent form</a>, if you have not done so
        already. We will not be able to use your data, if the consent form has
        not been sign prior to the labelling activity.
      </p>
    </>
  );
}
