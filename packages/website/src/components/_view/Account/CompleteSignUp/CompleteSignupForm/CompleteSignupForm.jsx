import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import styles from '../CompleteSignUp.module.scss';
import FormTextField from '../../../Common/FormTextField/FormTextField';
import { equalValidator } from '../../../../../util/FormValidatorFunctions';

export default function CompleteSignupForm() {
  const [searchParams] = useSearchParams();
  const { getFieldState, getValues, trigger } = useFormContext();

  const passwordsMatchValidator = equalValidator(
    getValues,
    'newPassword',
    'repeatNewPassword',
    'Passwords do not match.'
  );

  return (
    <>
      <div className={styles.horizontalInputs}>
        <FormTextField
          name="firstName"
          label="First name"
          autocomplete="given-name"
          defaultValue={searchParams.get('firstName')}
          rules={{
            required: { value: true, message: 'First name is required.' },
          }}
        />
        <FormTextField
          name="lastName"
          label="Last name"
          autocomplete="family-name"
          defaultValue={searchParams.get('lastName')}
          rules={{
            required: { value: true, message: 'Last name is required.' },
          }}
        />
      </div>
      <FormTextField
        name="email"
        label="E-mail address"
        autocomplete="email"
        defaultValue={searchParams.get('email')}
        rules={{
          required: { value: true, message: 'E-mail address is required.' },
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'E-mail address must be a valid e-mail.',
          },
        }}
      />
      <FormTextField
        name="currentPassword"
        label="Current password"
        type="password"
        autocomplete="off"
        defaultValue={searchParams.get('code')}
        defaultHelperText="Your current password should have been sent to you in an e-mail inviting you to the platform."
        rules={{
          required: { value: true, message: 'Current password is required.' },
        }}
      />
      <FormTextField
        name="newPassword"
        label="New password"
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
              const repeatNewPasswordState = getFieldState('repeatNewPassword');
              if (repeatNewPasswordState && repeatNewPasswordState.isDirty) {
                trigger('repeatNewPassword');
              }
            },
          },
        }}
      />
      <FormTextField
        name="repeatNewPassword"
        label="Repeat new password"
        type="password"
        autocomplete="off"
        rules={{
          required: {
            value: true,
            message: 'New password has to be repeated.',
          },
          validate: {
            passwordsMatchValidator,
          },
        }}
      />
    </>
  );
}
